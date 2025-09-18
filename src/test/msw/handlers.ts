import { http, HttpResponse } from 'msw';
import { movies } from '../fixtures/movies.ts';

export const moviesHandlers = [
  http.get(/\/movies(\?.*)?$/, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const genre = url.searchParams.get('filter');
    const sortBy = url.searchParams.get('sortBy') ?? 'release_date';
    const sortOrder = url.searchParams.get('sortOrder') ?? 'desc';

    let data = movies;

    data = data.filter(
      (m) =>
        (!search || m.title.toLowerCase().includes(search)) && (!genre || m.genres.includes(genre)),
    );

    data = data.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      const dir = sortOrder === 'asc' ? 1 : -1;
      return (a.year - b.year) * -dir;
    });

    return HttpResponse.json({ data, total: data.length, offset: 0, limit: 30 });
  }),
  http.get(/\/movies\/(\d+)(\?.*)?$/, ({ request }) => {
    const id = new URL(request.url).pathname.split('/').pop()!;
    const movie = movies.find((x) => String(x.id) === id);

    if (!movie) {
      return HttpResponse.json({ message: 'Movie not found' }, { status: 404 });
    }

    return HttpResponse.json(movie);
  }),
];
