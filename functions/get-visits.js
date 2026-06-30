const PASSWORD_HASH = 'd2e0e79797d4189475cb66ebe6dd1bab8f5c285b9fcb7451caa43931d91e578b';

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const submitted = url.searchParams.get('p');

  if (!submitted) {
    return new Response(JSON.stringify({ error: 'no password' }), { status: 401 });
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(submitted);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  if (hash !== PASSWORD_HASH) {
    return new Response(JSON.stringify({ error: 'wrong password' }), { status: 401 });
  }

  try {
    const { keys } = await env.VISITS.list();
    const visits = [];
    for (const key of keys) {
      const raw = await env.VISITS.get(key.name);
      if (raw) { try { visits.push(JSON.parse(raw)); } catch(e) {} }
    }
    visits.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return new Response(JSON.stringify(visits), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
