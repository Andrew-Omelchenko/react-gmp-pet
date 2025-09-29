import { http, HttpResponse } from 'msw';
import { movies } from '../fixtures/movies.ts';
import { releaseDateToYear } from '../../core/api/mappers.ts';

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
  http.put('*/movies', async ({ request }) => {
    const body = (await request.json()) as {
      id?: number | string;
      title?: string;
      poster_path?: string;
      overview?: string;
      runtime?: number;
      release_date?: string;
      vote_average?: number;
      genres?: string[];
    };

    if (body?.id == null) {
      return HttpResponse.json({ message: 'Missing id' }, { status: 400 });
    }

    const idx: number = movies.findIndex((m) => String(m.id) === String(body.id));

    if (idx === -1) {
      return HttpResponse.json({ message: 'Movie not found' }, { status: 404 });
    }

    movies[idx] = {
      ...movies[idx],
      id: (body.id ?? movies[idx].id) as number,
      title: body.title ?? movies[idx].title,
      poster_path: body.poster_path ?? movies[idx].poster_path,
      overview: body.overview ?? movies[idx].overview,
      year: releaseDateToYear(body.release_date) ?? movies[idx].year,
      genres: body.genres ?? movies[idx].genres,
      vote_average: body.vote_average ?? movies[idx].vote_average,
      runtime: (body.runtime != null ? `${body.runtime} min` : movies[idx].runtime) as number,
    };

    return HttpResponse.json({ ...body }, { status: 200 });
  }),
];
