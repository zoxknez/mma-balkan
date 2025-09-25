export default function Loading() {
  return (
    <div className="card">
      <div className="skeleton" style={{height:20,width:'40%',borderRadius:8}} />
      <div className="skeleton" style={{height:12,marginTop:10,borderRadius:8}} />
      <div className="skeleton" style={{height:12,marginTop:8,borderRadius:8}} />
    </div>
  );
}
