import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="card" style={{marginTop:24,textAlign:'center'}}>
      <h2 style={{marginTop:0}}>404 — Nije pronađeno</h2>
      <p className="muted">Stranica koju tražite ne postoji ili je premeštena.</p>
      <div style={{marginTop:12}}>
        <Link href="/" className="badge">← Nazad na početnu</Link>
      </div>
    </div>
  );
}
