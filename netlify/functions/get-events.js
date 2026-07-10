const { getStore } = require('@netlify/blobs');

exports.handler = async function(event) {
  try {
    const store = getStore({
      name: 'events',
      siteID: 'edc5baa1-dc73-41f1-ae4e-047506160b63',
      token: 'nfp_8sEbEccgDAmxPv6r1CkXnovaSmZmiJnRe6bd'
    });
    const { blobs } = await store.list();
    const events = [];
    for (const blob of blobs) {
      const raw = await store.get(blob.key);
      if (raw) { try { events.push(JSON.parse(raw)); } catch(e) {} }
    }
    events.sort((a, b) => new Date(a.date.year, monthIdx(a.date.month), a.date.day) - new Date(b.date.year, monthIdx(b.date.month), b.date.day));
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(events)
    };
  } catch(e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};

function monthIdx(m) {
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(m);
}
