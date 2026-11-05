import { Coupon, Order, Product, StoreSettings } from '../types';

export const STORE_INFO = {
  brandShort: 'Jainzee™',
  brandFull_en: 'Jainzee™ Food Processing Industries',
  brandFull_hi: 'जैनज़ी™ फूड प्रोसेसिंग इंडस्ट्रीज़',
  tagline_en: 'Pure & Premium Dry Fruits',
  tagline_hi: 'शुद्ध और प्रीमियम ड्राई फ्रूट्स',
  fssaiLicense: '11423850001080',
  address_en: 'Siyaganj, Indore, Madhya Pradesh 452001',
  address_hi: 'सियागंज, इंदौर, मध्य प्रदेश 452001',
  phone: '+91 97529 37733',
  whatsappNumber: '919752937733',
  email: 'info@jainzee.in',
  hours_en: 'Mon - Sun: 10:00 AM - 9:00 PM',
  hours_hi: 'सोम - रवि: सुबह 10:00 - रात 9:00',
  freeShippingThreshold: 999,
  freeShippingMaxKm: 7,
  perKmRate: 5,
  baseDeliveryCharge: 15,
  minDiwaliBoxPriceAfterDiscount: 1300,
  upiId: '',
  logoUrl: '/images/brand-logo-circle.png',
  fssaiLogoUrl: '/static/images/fssai-logo.png',
  bannerVideoUrl: '/static/uploads/main_banner_video.mp4',
  diwaliVideoUrl: '/static/uploads/diwali_special_edited.mp4',
  about_en:
    "Jainzee™ Food Processing Industries is a trusted name for pure, hygienic and premium quality dry fruits. We source the finest cashews, pistachios, almonds, walnuts, makhana and raisins so you can enjoy nature's best, every single day.",
  about_hi:
    'जैनज़ी™ फूड प्रोसेसिंग इंडस्ट्रीज़ शुद्ध, स्वच्छ और प्रीमियम गुणवत्ता वाले ड्राई फ्रूट्स के लिए एक विश्वसनीय नाम है। हम सबसे बेहतरीन काजू, पिस्ता, बादाम, अखरोट, मखाना और किशमिश लाते हैं ताकि आप हर दिन प्रकृति का सर्वश्रेष्ठ आनंद ले सकें।',
};

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  shopName_en: STORE_INFO.brandFull_en,
  shopName_hi: STORE_INFO.brandFull_hi,
  tagline_en: STORE_INFO.tagline_en,
  tagline_hi: STORE_INFO.tagline_hi,
  about_en: STORE_INFO.about_en,
  about_hi: STORE_INFO.about_hi,
  address_en: STORE_INFO.address_en,
  address_hi: STORE_INFO.address_hi,
  phone: STORE_INFO.phone,
  whatsappNumber: STORE_INFO.whatsappNumber,
  email: STORE_INFO.email,
  hours_en: STORE_INFO.hours_en,
  hours_hi: STORE_INFO.hours_hi,
  globalDiscountPercent: 0,
  upiId: STORE_INFO.upiId,
  gstin: '',
  gstRatePercent: 5,
  freeShippingThreshold: 999,
  freeShippingMaxKm: 7,
  perKmRate: 5,
  baseDeliveryCharge: 15,
  minDiwaliBoxPriceAfterDiscount: 1300,
  razorpayKeyId: (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || 'rzp_live_TvorDloFWDaxeT',
  twilioAccountSid: '',
  twilioVerifySid: '',
  smtpHost: 'smtp.gmail.com',
  smtpPort: '587',
  smtpUser: 'info@jainzee.in',
};

export function calculateKmDeliveryCharge(
  distanceKm: number,
  perKmRate = STORE_INFO.perKmRate,
  baseCharge = STORE_INFO.baseDeliveryCharge
): number {
  const km = Math.max(1, Math.round(distanceKm || 1));
  if (km <= 3) return Math.max(20, baseCharge + km * perKmRate);
  if (km <= 15) return baseCharge + km * perKmRate;
  if (km <= 50) return Math.round(90 + (km - 15) * 2.5);
  return Math.min(250, Math.round(175 + (km - 50) * 0.5));
}

export function calculateOrderShippingCharge(
  subtotal: number,
  distanceKm: number,
  freeThreshold = STORE_INFO.freeShippingThreshold,
  freeMaxKm = STORE_INFO.freeShippingMaxKm,
  perKmRate = STORE_INFO.perKmRate,
  baseCharge = STORE_INFO.baseDeliveryCharge
): {
  shipping: number;
  isAboveMinOrder: boolean;
  isFreeKmQualified: boolean;
  extraKm: number;
} {
  if (subtotal <= 0) {
    return { shipping: 0, isAboveMinOrder: false, isFreeKmQualified: true, extraKm: 0 };
  }
  const km = Math.max(1, Math.round(distanceKm || 1));
  const isAboveMinOrder = subtotal >= freeThreshold;
  const isFreeKmQualified = km <= freeMaxKm;

  if (isAboveMinOrder) {
    if (isFreeKmQualified) {
      return { shipping: 0, isAboveMinOrder, isFreeKmQualified: true, extraKm: 0 };
    }
    const extraKm = km - freeMaxKm;
    // Discounted rate for extra distance (Rs 4/km without standard base charge)
    const extraShipping = Math.max(10, Math.round(extraKm * 4));
    return { shipping: extraShipping, isAboveMinOrder, isFreeKmQualified: false, extraKm };
  }

  const standardShipping = calculateKmDeliveryCharge(km, perKmRate, baseCharge);
  return { shipping: standardShipping, isAboveMinOrder: false, isFreeKmQualified, extraKm: 0 };
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    sku: 'CAS-001',
    category: 'cashews',
    categoryLabel_en: 'All 8 Grades in 1kg & 500g',
    categoryLabel_hi: 'सभी 8 ग्रेड (1kg और 500g में)',
    name_en: 'Premium Cashew (Kaju)',
    name_hi: 'प्रीमियम काजू',
    subtitle_en: 'Choose Grade: W400, Wmix, W320, W260, W240, W210, JK, JH (1kg / 500g)',
    subtitle_hi: 'ग्रेड चुनें: W400, Wmix, W320, W260, W240, W210, JK, JH (1kg / 500g)',
    description_en:
      'Large, creamy and hygienically graded premium whole cashews in all 8 export & wholesale grades (W400, Wmix, W320, W260, W240, W210, JK & JH). Choose your desired grade and pack size (1kg or 500g).',
    description_hi:
      'बड़े, क्रीमी और स्वच्छ रूप से ग्रेड किए गए प्रीमियम काजू — सभी 8 ग्रेड (W400, Wmix, W320, W260, W240, W210, JK और JH) में उपलब्ध। अपनी पसंद का ग्रेड और पैक साइज (1kg या 500g) चुनें।',
    origin_en: 'Siyaganj, Indore',
    origin_hi: 'सियागंज, इंदौर',
    image: '/images/cashew.jpeg',
    fallbackColor: '#F5EFE6',
    stock: 200,
    featuredTag_en: '8 Grades Available',
    featuredTag_hi: '8 ग्रेड उपलब्ध',
    grades: [
      { label: 'W400 (1kg)', weightGrams: 1000, price: 879, oldPrice: 999 },
      { label: 'W400 (500g)', weightGrams: 500, price: 499, oldPrice: 579 },
      { label: 'Wmix (1kg)', weightGrams: 1000, price: 899, oldPrice: 1049 },
      { label: 'Wmix (500g)', weightGrams: 500, price: 455, oldPrice: 539 },
      { label: 'W320 (1kg)', weightGrams: 1000, price: 949, oldPrice: 1099 },
      { label: 'W320 (500g)', weightGrams: 500, price: 479, oldPrice: 569 },
      { label: 'W260 (1kg)', weightGrams: 1000, price: 999, oldPrice: 1149 },
      { label: 'W260 (500g)', weightGrams: 500, price: 501, oldPrice: 599 },
      { label: 'W240 (1kg)', weightGrams: 1000, price: 1030, oldPrice: 1199 },
      { label: 'W240 (500g)', weightGrams: 500, price: 519, oldPrice: 629 },
      { label: 'W210 Jumbo (1kg)', weightGrams: 1000, price: 1099, oldPrice: 1299 },
      { label: 'W210 Jumbo (500g)', weightGrams: 500, price: 499, oldPrice: 619 },
      { label: 'JK Grade (1kg)', weightGrams: 1000, price: 879, oldPrice: 999 },
      { label: 'JK Grade (500g)', weightGrams: 500, price: 449, oldPrice: 529 },
      { label: 'JH Split (1kg)', weightGrams: 1000, price: 920, oldPrice: 1049 },
      { label: 'JH Split (500g)', weightGrams: 500, price: 469, oldPrice: 549 },
    ],
    nutritionPer100g: { energyKcal: 553, proteinG: 18.2, healthyFatsG: 43.8, fiberG: 3.3 },
    reviews: [],
  },
  {
    id: 2,
    sku: 'MAK-001',
    category: 'makhana',
    categoryLabel_en: '1kg / 500g Pack',
    categoryLabel_hi: '1kg / 500g पैक',
    name_en: 'Makhana (Phool Makhana)',
    name_hi: 'प्रीमियम फूल मखाना',
    subtitle_en: 'Extra Bold Handpicked Fox Nuts (1kg / 500g)',
    subtitle_hi: 'एक्स्ट्रा बोल्ड हैंडपिक्ड फूल मखाना (1kg / 500g)',
    description_en:
      'Snow-white, extra-bold 6-Suta Mithila Phool Makhana (Fox Nuts). Naturally rich in calcium, protein and antioxidants — light, crunchy and ideal for roasting or fasting.',
    description_hi:
      'सफेद, बड़े दाने वाले प्रीमियम फूल मखाना। कैल्शियम, प्रोटीन और एंटीऑक्सीडेंट से भरपूर — भूनकर खाने और व्रत के लिए सर्वोत्तम।',
    origin_en: 'Siyaganj, Indore',
    origin_hi: 'सियागंज, इंदौर',
    image: '/static/uploads/Gemini_Generated_Image_6qjj8c6qjj8c6qjj.png',
    fallbackColor: '#FDF8EE',
    stock: 100,
    featuredTag_en: 'Superfood',
    featuredTag_hi: 'सुपरफूड',
    grades: [
      { label: '1kg', weightGrams: 1000, price: 1349, oldPrice: 1549 },
      { label: '500g', weightGrams: 500, price: 679, oldPrice: 799 },
    ],
    nutritionPer100g: { energyKcal: 347, proteinG: 9.7, healthyFatsG: 0.1, fiberG: 14.5 },
    reviews: [],
  },
  {
    id: 3,
    sku: 'ALM-001',
    category: 'almonds',
    categoryLabel_en: '1kg / 500g Pack',
    categoryLabel_hi: '1kg / 500g पैक',
    name_en: 'Badam (Almonds)',
    name_hi: 'प्रीमियम बादाम',
    subtitle_en: 'California Almonds (1kg / 500g)',
    subtitle_hi: 'कैलिफोर्निया बादाम (1kg / 500g)',
    description_en:
      'California almonds, hand-sorted for uniform size. Perfect for daily nutrition and healthy snacking.',
    description_hi:
      'हैंड-सॉर्टेड कैलिफोर्निया बादाम, एक समान आकार के। दैनिक पोषण और स्वस्थ नाश्ते के लिए उत्तम।',
    origin_en: 'Siyaganj, Indore',
    origin_hi: 'सियागंज, इंदौर',
    image: '/images/almonds.webp',
    fallbackColor: '#F7EFE4',
    stock: 150,
    featuredTag_en: 'Premium',
    featuredTag_hi: 'प्रीमियम',
    grades: [
      { label: '1kg', weightGrams: 1000, price: 1249, oldPrice: 1449 },
      { label: '500g', weightGrams: 500, price: 629, oldPrice: 749 },
    ],
    nutritionPer100g: { energyKcal: 579, proteinG: 21.2, healthyFatsG: 49.9, fiberG: 12.5 },
    reviews: [],
  },
  {
    id: 4,
    sku: 'WAL-001',
    category: 'walnuts',
    categoryLabel_en: '1kg / 500g Pack',
    categoryLabel_hi: '1kg / 500g पैक',
    name_en: 'Akhrot (Walnuts)',
    name_hi: 'प्रीमियम अखरोट',
    subtitle_en: 'Whole Walnuts (1kg / 500g)',
    subtitle_hi: 'साबुत अखरोट (1kg / 500g)',
    description_en:
      'Whole walnuts with light-colored kernels, rich in Omega-3 fatty acids and antioxidants.',
    description_hi:
      'हल्के रंग की गिरी वाले साबुत अखरोट, ओमेगा-3 फैटी एसिड और एंटीऑक्सीडेंट से भरपूर।',
    origin_en: 'Siyaganj, Indore',
    origin_hi: 'सियागंज, इंदौर',
    image: '/images/walnuts.webp',
    fallbackColor: '#F3ECE3',
    stock: 100,
    featuredTag_en: 'Premium',
    featuredTag_hi: 'प्रीमियम',
    grades: [
      { label: '1kg', weightGrams: 1000, price: 899, oldPrice: 1049 },
      { label: '500g', weightGrams: 500, price: 449, oldPrice: 549 },
    ],
    nutritionPer100g: { energyKcal: 654, proteinG: 15.2, healthyFatsG: 65.2, fiberG: 6.7 },
    reviews: [],
  },
  {
    id: 5,
    sku: 'RAI-001',
    category: 'dried-fruits',
    categoryLabel_en: '1kg / 500g Pack',
    categoryLabel_hi: '1kg / 500g पैक',
    name_en: 'Kishmish (Raisins)',
    name_hi: 'किशमिश',
    subtitle_en: 'Golden Sun-Dried Raisins (1kg / 500g)',
    subtitle_hi: 'प्राकृतिक किशमिश (1kg / 500g)',
    description_en:
      'Golden raisins, naturally sun-dried. Sweet, juicy and full of natural energy.',
    description_hi:
      'गोल्डन किशमिश, प्राकृतिक रूप से धूप में सुखाई गई। मीठी, रसीली और प्राकृतिक ऊर्जा से भरपूर।',
    origin_en: 'Siyaganj, Indore',
    origin_hi: 'सियागंज, इंदौर',
    image: '/images/raisins.webp',
    fallbackColor: '#F6F1E3',
    stock: 200,
    featuredTag_en: 'Best Value',
    featuredTag_hi: 'बेस्ट वैल्यू',
    grades: [
      { label: '1kg', weightGrams: 1000, price: 549, oldPrice: 649 },
      { label: '500g', weightGrams: 500, price: 279, oldPrice: 349 },
    ],
    nutritionPer100g: { energyKcal: 299, proteinG: 3.1, healthyFatsG: 0.5, fiberG: 3.7 },
    reviews: [],
  },
  {
    id: 6,
    sku: 'PIS-001',
    category: 'pistachios',
    categoryLabel_en: '500g / 1kg Pack',
    categoryLabel_hi: '500g / 1kg पैक',
    name_en: 'Iranian Pistachio (Pista)',
    name_hi: 'ईरानी पिस्ता (Pista)',
    subtitle_en: 'Roasted & Naturally Salted (500g / 1kg)',
    subtitle_hi: 'रोस्टेड और नमकीन पिस्ता (500g / 1kg)',
    description_en:
      'Premium Iranian pistachios - crunchy, flavorful and naturally salted. A great source of protein and fiber.',
    description_hi:
      'प्रीमियम ईरानी पिस्ता - कुरकुरे, स्वादिष्ट और प्राकृतिक नमकीन। प्रोटीन और फाइबर का बेहतरीन स्रोत।',
    origin_en: 'Siyaganj, Indore',
    origin_hi: 'सियागंज, इंदौर',
    image: '/images/pistachio.webp',
    fallbackColor: '#EEF2E6',
    stock: 80,
    featuredTag_en: 'Premium',
    featuredTag_hi: 'प्रीमियम',
    grades: [
      { label: '500g', weightGrams: 500, price: 899, oldPrice: 1099 },
      { label: '1kg', weightGrams: 1000, price: 1699, oldPrice: 1999 },
    ],
    nutritionPer100g: { energyKcal: 562, proteinG: 20.6, healthyFatsG: 45.3, fiberG: 10.6 },
    reviews: [],
  },
  {
    id: 7,
    sku: 'DIW-001',
    category: 'gifting',
    categoryLabel_en: 'Diwali Special Edition',
    categoryLabel_hi: 'दिवाली स्पेशल एडिशन',
    name_en: 'Diwali Special Royal 4-Jar Gift Box',
    name_hi: 'दिवाली स्पेशल रॉयल 4-जार गिफ्ट बॉक्स',
    subtitle_en: 'Luxury Peacock Box with 4 Gold Glass Jars',
    subtitle_hi: 'लक्ज़री मयूर बॉक्स (4 गोल्ड ग्लास जार के साथ)',
    description_en:
      'Handcrafted Royal Peacock Palace wooden-finish gift box with brass latch and satin lining, containing 4 airtight gold-lid glass jars filled with signature Siyaganj Cashews, Almonds, Pistachios & Kishmish.',
    description_hi:
      'विशेष दिवाली उपहार: रॉयल मयूर पैलेस गिफ्ट बॉक्स (साटन लाइनिंग और 4 गोल्ड ग्लास जार में प्रीमियम काजू, बादाम, पिस्ता और किशमिश के साथ)।',
    origin_en: 'Siyaganj, Indore',
    origin_hi: 'सियागंज, इंदौर',
    image: '/images/diwali-gift-box.jpg',
    video: '/static/uploads/diwali_special_edited.mp4',
    fallbackColor: '#1E293B',
    stock: 50,
    featuredTag_en: 'Diwali Special',
    featuredTag_hi: 'दिवाली स्पेशल',
    grades: [
      { label: 'Royal 4-Jar Gift Box', weightGrams: 1000, price: 1350, oldPrice: 1699 },
    ],
    nutritionPer100g: { energyKcal: 545, proteinG: 17.8, healthyFatsG: 42.5, fiberG: 7.4 },
    reviews: [],
  },
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    id: 1,
    code: 'JAINZEE10',
    title_en: '10% OFF on Dry Fruits (Diwali Box net ₹1,300)',
    title_hi: 'ड्राई फ्रूट्स पर 10% छूट (दिवाली बॉक्स नेट ₹1,300)',
    discountType: 'percent',
    discountValue: 10,
    minOrderAmount: 0,
    expiryDate: '2026-12-31',
    usageLimit: 0,
    usedCount: 14,
    isActive: true,
  },
  {
    id: 2,
    code: 'DIWALI10',
    title_en: 'Festive Coupon — 10% OFF (Diwali Box Special Net ₹1,300)',
    title_hi: 'दिवाली स्पेशल कूपन — 10% छूट (दिवाली बॉक्स नेट ₹1,300)',
    discountType: 'percent',
    discountValue: 10,
    minOrderAmount: 0,
    expiryDate: '2026-11-30',
    usageLimit: 0,
    usedCount: 28,
    isActive: true,
  },
];

export const SAMPLE_ORDERS: Order[] = [];
