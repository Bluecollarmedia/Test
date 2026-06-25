const { getStore } = require('@netlify/blobs');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*' }, body: '' };
  }
  try {
    const store = getStore({
      name: 'visits',
      siteID: 'edc5baa1-dc73-41f1-ae4e-047506160b63',
      token: 'nfp_8j4BPj8bDLv394xAAd8b2phfdgVuv5v22067'
    });
    const now = new Date();
    await store.set(`visit-${now.getTime()}`, JSON.stringify({
      timestamp: now.toISOString(),
      ua: (event.headers['user-agent'] || '').substring(0, 120)
    }));
  } catch (e) { /* silent fail */ }
  return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: 'ok' };
};
