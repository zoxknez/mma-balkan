export default function Loading() {
  return (
    <div className="card">
      <div className="skeleton" style={{height:22,width:'55%',borderRadius:8}}></div>
      <div className="skeleton" style={{height:12,marginTop:12,borderRadius:8}}></div>
      <div className="skeleton" style={{height:12,marginTop:8,borderRadius:8}}></div>
      <div className="skeleton" style={{height:12,marginTop:8,borderRadius:8}}></div>
    </div>
  );
}
