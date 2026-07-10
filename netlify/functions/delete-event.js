const { getStore } = require('@netlify/blobs');
const crypto = require('crypto');

const PASSWORD_HASH = 'd2e0e79797d4189475cb66ebe6dd1bab8f5c285b9fcb7451caa43931d91e578b';

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  let body;
  try { body = JSON.parse(event.body); } catch(e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'invalid JSON' }) };
  }

  const hash = crypto.createHash('sha256').update(body.p || '').digest('hex');
  if (hash !== PASSWORD_HASH) return { statusCode: 401, body: JSON.stringify({ error: 'wrong password' }) };

  try {
    const store = getStore({
      name: 'events',
      siteID: 'edc5baa1-dc73-41f1-ae4e-047506160b63',
      token: 'nfp_8sEbEccgDAmxPv6r1CkXnovaSmZmiJnRe6bd'
    });
    await store.delete(body.id);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true })
    };
  } catch(e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
