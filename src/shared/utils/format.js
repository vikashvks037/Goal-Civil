export { formatCurrency, formatDate, slugify } from '@/lib/helpers';
export const truncate=(s,max)=>s.length<=max?s:s.slice(0,max).trimEnd()+'…';
export const pluralize=(n,s,p)=>`${n} ${n===1?s:(p??s+'s')}`;
