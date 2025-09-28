// Simple production smoke test
// Usage (PowerShell): $env:SITE='https://mma-balkan.org'; node scripts/smoke.mjs
// Or: node scripts/smoke.mjs (defaults to https://mma-balkan.org)

const SITE = process.env.SITE || 'https://mma-balkan.org';
const TIMEOUT_MS = 15000;

function withTimeout(promise, ms, label = 'request') {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise.then((v) => { clearTimeout(id); resolve(v); }, (e) => { clearTimeout(id); reject(e); });
  });
}

async function check(path, expect = {}) {
  const url = `${SITE}${path}`;
  const start = Date.now();
  try {
    const res = await withTimeout(fetch(url, { cache: 'no-store' }), TIMEOUT_MS, `GET ${path}`);
    const ct = res.headers.get('content-type') || '';
    let body = '';
    if ((ct.includes('text/') || ct.includes('application/xml') || ct.includes('application/json')) && res.ok) {
      body = await res.text();
    }
    const ms = Date.now() - start;
    const statusOk = expect.status ? expect.status === res.status : res.ok;
    const textOk = expect.includes ? body.includes(expect.includes) : true;
    const ctOk = expect.contentType ? ct.includes(expect.contentType) : true;
    const ok = statusOk && textOk && ctOk;
    console.log(`${ok ? '✅' : '❌'} ${res.status} ${path} (${ms}ms) ct=${ct}`);
    if (!ok) {
      throw new Error(`Expectation failed for ${path}: statusOk=${statusOk} textOk=${textOk} ctOk=${ctOk}`);
    }
    return true;
  } catch (e) {
    console.error(`❌ Error for ${path}:`, e.message);
    return false;
  }
}

(async () => {
  console.log(`Running smoke tests against: ${SITE}`);
  const results = await Promise.all([
    check('/', { status: 200 }),
    check('/fighters', { status: 200 }),
    check('/events', { status: 200 }),
    check('/sitemap.xml', { status: 200, contentType: 'application/xml' }),
    check('/robots.txt', { status: 200, contentType: 'text/plain' }),
  ]);

  const passed = results.filter(Boolean).length;
  const total = results.length;
  console.log(`\nSmoke summary: ${passed}/${total} passed`);
  if (passed !== total) process.exit(1);
})();
