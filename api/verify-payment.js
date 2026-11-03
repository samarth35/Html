import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'UserFlH9eIpM0GeKw0kV4qRB';

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
  }

  const expectedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    return res.status(200).json({ success: true, message: 'Payment signature verified successfully' });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }
}
