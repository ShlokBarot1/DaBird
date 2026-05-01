export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.dabird.net');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { eventName, email, phone, value, currency, contentIds, url } = req.body;

  const [hashedEmail, hashedPhone] = await Promise.all([
    email ? sha256(email) : Promise.resolve(null),
    phone ? sha256(phone) : Promise.resolve(null),
  ]);

  const payload = {
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: url,
      action_source: 'website',
      user_data: {
        em: hashedEmail ? [hashedEmail] : [],
        ph: hashedPhone ? [hashedPhone] : [],
        client_ip_address: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || '',
        client_user_agent: req.headers['user-agent'] || '',
      },
      custom_data: {
        value,
        currency: currency || 'GBP',
        content_ids: contentIds || [],
        content_type: 'product',
      },
    }],
  };

  try {
    await fetch(
      `https://graph.facebook.com/v19.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    res.status(200).json({ success: true });
  } catch {
    res.status(500).json({ error: 'CAPI request failed' });
  }
}

async function sha256(value) {
  const msgBuffer = new TextEncoder().encode(value.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
