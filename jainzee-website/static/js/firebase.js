// Firebase Client Configuration & Authentication Helper for Jainzee
const firebaseConfig = {
    apiKey: "AIzaSyBqi2hpDhMsI1X3tjVPXbaHuMLh9mRD8Ao",
    authDomain: "jainzee-dd1d7.firebaseapp.com",
    projectId: "jainzee-dd1d7",
    storageBucket: "jainzee-dd1d7.firebasestorage.app",
    messagingSenderId: "595345456947",
    appId: "1:595345456947:web:a227155aa0e0a09243c846",
    measurementId: "G-QKZB611ZZG"
};

// Initialize Firebase if loaded
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Global state for Firebase phone confirmation
window.confirmationResult = null;
window.recaptchaVerifier = null;

function getCsrfToken() {
    const parts = (document.cookie || '').split(';');
    for (let i = 0; i < parts.length; i++) {
        const kv = parts[i].trim();
        const eq = kv.indexOf('=');
        if (eq > -1 && kv.substring(0, eq) === 'csrf_token') {
            return decodeURIComponent(kv.substring(eq + 1));
        }
    }
    return '';
}

/**
 * Safely reset and clean the reCAPTCHA verifier and DOM container
 */
function resetRecaptcha(containerId = 'recaptcha-container') {
    if (window.recaptchaVerifier) {
        try {
            window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = null;
    }
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    }
}

/**
 * Initialize or get invisible reCAPTCHA verifier for Phone Auth
 */
function getRecaptchaVerifier(containerId = 'recaptcha-container') {
    if (window.recaptchaVerifier) {
        return window.recaptchaVerifier;
    }
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn('Recaptcha container #' + containerId + ' not found in DOM.');
        return null;
    }
    container.innerHTML = ''; // Clean element before rendering new reCAPTCHA
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(containerId, {
        size: 'invisible',
        callback: function (response) {
            // reCAPTCHA solved
        },
        'expired-callback': function () {
            if (window.recaptchaVerifier) {
                try {
                    window.recaptchaVerifier.render().then(function(widgetId) {
                        if (typeof grecaptcha !== 'undefined') grecaptcha.reset(widgetId);
                    });
                } catch (e) {}
            }
        }
    });
    return window.recaptchaVerifier;
}

/**
 * Send Phone OTP via Firebase SMS
 * @param {string} rawPhone - 10-digit or E.164 phone number
 * @param {string} containerId - Element ID for reCAPTCHA
 */
async function sendFirebasePhoneOtp(rawPhone, containerId = 'recaptcha-container') {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        throw new Error('Firebase Auth library is not loaded.');
    }

    // Format phone to E.164 standard (+91 for India if not provided)
    let formattedPhone = rawPhone.trim().replace(/[\s-]/g, '');
    if (!formattedPhone.startsWith('+')) {
        if (formattedPhone.length === 10) {
            formattedPhone = '+91' + formattedPhone;
        } else if (formattedPhone.length === 12 && formattedPhone.startsWith('91')) {
            formattedPhone = '+' + formattedPhone;
        } else {
            formattedPhone = '+91' + formattedPhone;
        }
    }

    const appVerifier = getRecaptchaVerifier(containerId);
    if (!appVerifier) {
        throw new Error('Could not initialize reCAPTCHA verifier.');
    }

    try {
        const confirmationResult = await firebase.auth().signInWithPhoneNumber(formattedPhone, appVerifier);
        window.confirmationResult = confirmationResult;
        return {
            success: true,
            phoneNumber: formattedPhone,
            message: 'SMS verification code sent to ' + formattedPhone
        };
    } catch (error) {
        resetRecaptcha(containerId);
        throw error;
    }
}

/**
 * Verify Phone OTP code
 * @param {string} verificationCode - 6-digit OTP
 */
async function verifyFirebasePhoneOtp(verificationCode) {
    if (!window.confirmationResult) {
        throw new Error('No active OTP session found. Please request a new OTP.');
    }
    const result = await window.confirmationResult.confirm(verificationCode.trim());
    const user = result.user;
    return await syncFirebaseUserWithBackend(user);
}

/**
 * Send Passwordless Email Magic Link
 * @param {string} email - Recipient email address
 */
async function sendFirebaseEmailLink(email) {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        throw new Error('Firebase Auth library is not loaded.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const actionCodeSettings = {
        url: window.location.origin + '/customer?emailLogin=true',
        handleCodeInApp: true
    };

    await firebase.auth().sendSignInLinkToEmail(cleanEmail, actionCodeSettings);
    window.localStorage.setItem('jainzee_email_for_signin', cleanEmail);

    return {
        success: true,
        email: cleanEmail,
        message: 'A secure sign-in link has been sent to ' + cleanEmail + '. Click the link in your email to log in!'
    };
}

/**
 * Check and complete Email Passwordless Sign-In
 */
async function handleFirebaseEmailLinkSignIn() {
    if (typeof firebase === 'undefined' || !firebase.auth) return null;
    
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        let email = window.localStorage.getItem('jainzee_email_for_signin');
        if (!email) {
            email = window.prompt('Please confirm your email address to complete sign in:');
        }
        if (!email) return null;

        const result = await firebase.auth().signInWithEmailLink(email, window.location.href);
        window.localStorage.removeItem('jainzee_email_for_signin');
        
        if (window.history && window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        return await syncFirebaseUserWithBackend(result.user);
    }
    return null;
}

/**
 * Sync Firebase authenticated user with Flask backend session & JWT
 * @param {object} user - Firebase user object
 */
async function syncFirebaseUserWithBackend(user) {
    const idToken = await user.getIdToken();
    const payload = {
        phone: user.phoneNumber || '',
        email: user.email || '',
        uid: user.uid,
        name: user.displayName || '',
        idToken: idToken
    };

    const headers = { 'Content-Type': 'application/json' };
    const csrf = getCsrfToken();
    if (csrf) {
        headers['X-CSRF-TOKEN'] = csrf;
    }

    const res = await fetch('/api/customer/firebase-login', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'Backend session sync failed.');
    }

    if (data.token) {
        localStorage.setItem('jainzee_token', data.token);
    }
    return data;
}

// Export for module systems (Node / Vite / Webpack) if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        firebaseConfig,
        sendFirebasePhoneOtp,
        verifyFirebasePhoneOtp,
        sendFirebaseEmailLink,
        handleFirebaseEmailLinkSignIn,
        syncFirebaseUserWithBackend,
        resetRecaptcha
    };
}
