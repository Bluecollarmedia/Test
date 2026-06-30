export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const now = new Date();
    const ua = (request.headers.get('user-agent') || '').substring(0, 120);
    await env.VISITS.put(`visit-${now.getTime()}`, JSON.stringify({
      timestamp: now.toISOString(),
      ua
    }));
  } catch (e) { /* silent fail */ }

  return new Response('ok', { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
}
