import Link from 'next/link';

type Props =
  | { page: number; makeHref: (p: number) => string; hasNext: boolean; total?: never; limit?: never }
  | { page: number; makeHref: (p: number) => string; total: number; limit: number; hasNext?: never };

export default function Pagination(props: Props) {
  const { page, makeHref } = props;
  const computedHasNext = 'hasNext' in props ? props.hasNext : page * (props as Extract<Props,{total:number;limit:number}>).limit < (props as Extract<Props,{total:number;limit:number}>).total;
  const totalPages = 'total' in props ? Math.max(1, Math.ceil((props as Extract<Props,{total:number;limit:number}>).total / (props as Extract<Props,{total:number;limit:number}>).limit)) : undefined;
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center', flexWrap:'wrap' }}>
      {page > 1 && <Link href={makeHref(1)} className="btn">« Prva</Link>}
      {page > 1 && <Link href={makeHref(page - 1)} className="btn">← Prethodna</Link>}
      {totalPages && <span className="chip">Strana {page} {totalPages ? `od ${totalPages}` : ''}</span>}
      {computedHasNext && <Link href={makeHref(page + 1)} className="btn">Sledeća →</Link>}
      {computedHasNext && totalPages && <Link href={makeHref(totalPages)} className="btn">Poslednja »</Link>}
    </div>
  );
}
