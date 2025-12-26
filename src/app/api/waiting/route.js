import { kv } from '@vercel/kv';

export async function POST(req)
{
    const { userId } = await req.json();
    await kv.sadd('waiting_users', userId);
    return Response.json({ ok: true });
}

export async function GET()
{
    const ids = await kv.smembers('waiting_users');
    return Response.json(ids);
}
