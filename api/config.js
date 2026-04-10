export default async function handler(req, res) {
    const KV_URL = process.env.UPSTASH_REDIS_REST_URL;
    const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
    const ADMIN_HASH = process.env.ADMIN_HASH;

    if (!KV_URL || !KV_TOKEN) {
        return res.status(500).json({ error: 'KV not configured' });
    }

    const KEY = 'risk:config';

    async function kvGet() {
        const r = await fetch(`${KV_URL}/get/${KEY}`, {
            headers: { Authorization: `Bearer ${KV_TOKEN}` }
        });
        const data = await r.json();
        if (data.result) {
            try {
                let parsed = JSON.parse(data.result);
                if (typeof parsed === 'string') parsed = JSON.parse(parsed);
                return parsed;
            } catch { return {}; }
        }
        return {};
    }

    async function kvSet(obj) {
        await fetch(`${KV_URL}/set/${KEY}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${KV_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(JSON.stringify(obj))
        });
    }

    function isAuthed(req) {
        const auth = req.headers['authorization'] || '';
        const token = auth.replace('Bearer ', '');
        return token === ADMIN_HASH;
    }

    if (req.method === 'GET') {
        const config = await kvGet();
        const auth = req.headers['authorization'];
        if (auth) {
            if (!isAuthed(req)) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
        }
        return res.status(200).json(config);
    }

    if (req.method === 'POST') {
        if (!isAuthed(req)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const body = req.body || {};
        const config = {
            ca: body.ca || '',
            twitter: body.twitter || '',
            buy: body.buy || ''
        };

        await kvSet(config);
        return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
}
