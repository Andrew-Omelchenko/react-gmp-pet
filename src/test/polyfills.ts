// Polyfill for jsdom

// adds fetch, Request, Response, Headers to global/jsdom
import 'whatwg-fetch';

import { TextEncoder, TextDecoder } from 'util';
import { webcrypto } from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(globalThis as any).TextEncoder) (globalThis as any).TextEncoder = TextEncoder;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(globalThis as any).TextDecoder) (globalThis as any).TextDecoder = TextDecoder;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(globalThis as any).crypto) (globalThis as any).crypto = webcrypto;
