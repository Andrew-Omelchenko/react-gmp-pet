import { useSearchParams } from 'react-router-dom';
import { SearchForm } from '../../shared/ui/search-form';

export default function SearchRouteHeader() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') ?? '';

  const patch = (patch: Record<string, string | null | undefined>) => {
    const next = new URLSearchParams(searchParams);
    for (const [k, v] of Object.entries(patch)) {
      if (v == null || v === '') next.delete(k);
      else next.set(k, v);
    }
    setSearchParams(next, { replace: true });
  };

  return <SearchForm initialQuery={query} onSearch={(q) => patch({ query: q })} />;
}
