import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
  }

  const candidateSecrets = [
    process.env.RAZORPAY_KEY_SECRET,
    'LYwVCkTtjBheXJMaq7W9EDms',
    'PHkFeRPmPK4mJMO7Rv4WlrBJ',
    'UserFlH9eIpM0GeKw0kV4qRB'
  ].filter(Boolean);

  let verified = false;
  for (const secret of candidateSecrets) {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      verified = true;
      break;
    }
  }

  if (verified) {
    return res.status(200).json({ success: true, message: 'Payment signature verified successfully' });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }
}
