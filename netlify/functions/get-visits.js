const { getStore } = require('@netlify/blobs');
const crypto = require('crypto');

const PASSWORD_HASH = 'd2e0e79797d4189475cb66ebe6dd1bab8f5c285b9fcb7451caa43931d91e578b';

exports.handler = async function(event) {
  const submitted = (event.queryStringParameters || {}).p;
  if (!submitted) return { statusCode: 401, body: JSON.stringify({ error: 'no password' }) };

  const hash = crypto.createHash('sha256').update(submitted).digest('hex');
  if (hash !== PASSWORD_HASH) return { statusCode: 401, body: JSON.stringify({ error: 'wrong password' }) };

  try {
    const store = getStore({
      name: 'visits',
      siteID: 'edc5baa1-dc73-41f1-ae4e-047506160b63',
      token: 'nfp_8sEbEccgDAmxPv6r1CkXnovaSmZmiJnRe6bd'
    });
    const { blobs } = await store.list();
    const visits = [];
    for (const blob of blobs) {
      const raw = await store.get(blob.key);
      if (raw) { try { visits.push(JSON.parse(raw)); } catch(e){} }
    }
    visits.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(visits)
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
