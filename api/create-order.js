export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, currency = 'INR', receipt } = req.body || {};
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_live_TvorDloFWDaxeT';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'LYwVCkTtjBheXJMaq7W9EDms';

  if (!amount || amount < 100) {
    return res.status(400).json({ error: 'Amount must be at least 100 paise (₹1)' });
  }

  try {
    const auth = Buffer.from(`${key_id}:${key_secret}`).toString('base64');
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: Math.round(amount),
        currency,
        receipt: receipt || `rcpt_${Date.now()}`
      })
    });

    const data = await rzpRes.json();
    if (!rzpRes.ok) {
      if (rzpRes.status === 401) {
        return res.status(401).json({
          error: 'Razorpay Authentication failed. Please check API keys or use Cash on Delivery.'
        });
      }
      const errMsg = data.error ? data.error.description : 'Failed to create Razorpay order';
      return res.status(500).json({ error: errMsg });
    }

    return res.status(200).json({
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
      key_id
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
