const { getStore } = require('@netlify/blobs');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*' }, body: '' };
  }
  try {
    const store = getStore({
      name: 'visits',
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_API_TOKEN
    });
    const now = new Date();
    await store.set(`visit-${now.getTime()}`, JSON.stringify({
      timestamp: now.toISOString(),
      ua: (event.headers['user-agent'] || '').substring(0, 120)
    }));
  } catch (e) { /* silent fail */ }
  return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: 'ok' };
};
