import type { Preview } from '@storybook/react-vite';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { passthroughHandlers } from '../src/test/msw/passthroughHandlers';
import { moviesHandlers } from '../src/test/msw/handlers';

// Initialize MSW
initialize({
  serviceWorker: { url: '/mockServiceWorker.js' },
  onUnhandledRequest: 'error',
});

const preview: Preview = {
  decorators: [mswDecorator],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    msw: {
      handlers: [...passthroughHandlers, ...moviesHandlers],
    },
  },
};

export default preview;
