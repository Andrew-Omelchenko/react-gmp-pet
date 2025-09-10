import { http, passthrough } from 'msw';

export const passthroughHandlers = [
  http.get(/https:\/\/picsum\.photos\/.*/i, () => passthrough()),
  http.get(/https:\/\/image\.tmdb\.org\/.*/i, () => passthrough()),
  http.get(/\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i, () => passthrough()),
];
