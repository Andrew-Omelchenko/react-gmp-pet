export type ApiMovieBase = {
  title: string;
  tagline?: string;
  vote_average?: number;
  vote_count?: number;
  release_date?: string; // 'YYYY-MM-DD'
  poster_path: string;
  overview: string;
  budget?: number;
  revenue?: number;
  runtime: number; // minutes
  genres: string[];
};

export type ApiMovie = ApiMovieBase & { id: number };

export type ApiMoviesResponse = {
  data: ApiMovie[];
  total: number;
  offset: number;
  limit: number;
};
