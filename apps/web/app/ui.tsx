export function Section({ title, children, right }: { title?: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 24 }}>
      {title && (
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

export function MetaRow({ children }: { children: React.ReactNode }) {
  return <div className="muted" style={{ fontSize:'0.9rem' }}>{children}</div>;
}

export function List({ children }: { children: React.ReactNode }) {
  return <ul className="list">{children}</ul>;
}

export function Item({ children }: { children: React.ReactNode }) {
  return <li className="list-item">{children}</li>;
}