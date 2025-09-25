export default function Loading() {
  return (
    <div className="card">
      <div className="skeleton" style={{height:20,width:'30%',borderRadius:8}} />
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))',gap:12, marginTop:12}}>
        {Array.from({length:6}).map((_,i)=>(
          <div key={i} className="skeleton" style={{height:96,borderRadius:16}} />
        ))}
      </div>
    </div>
  );
}
