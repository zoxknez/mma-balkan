import { NextRequest, NextResponse } from 'next/server';

function formDataToJson(fd: FormData) {
  const obj: Record<string, any> = {};
  for (const [k, v] of fd.entries()) obj[k] = v;
  // Coerce known numeric fields
  ['age_a', 'age_b', 'reach_a', 'reach_b'].forEach((k) => {
    if (obj[k] !== undefined && obj[k] !== '') obj[k] = Number(obj[k]);
  });
  // Map kebab/camel if ever needed later
  return obj;
}

export async function POST(req: NextRequest) {
  const ct = req.headers.get('content-type') || '';
  let payload: any = {};
  try {
    if (ct.includes('application/json')) {
      payload = await req.json();
    } else if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
      const fd = await req.formData();
      payload = formDataToJson(fd as any);
    } else {
      // try json as best effort
      payload = await req.json().catch(() => ({}));
    }
  } catch {}

  const base = process.env.PREDICTOR_URL || 'http://127.0.0.1:8001';
  try {
    const r = await fetch(`${base}/predict`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json({ error: 'Predictor unavailable', detail: String(e) }, { status: 502 });
  }
}
