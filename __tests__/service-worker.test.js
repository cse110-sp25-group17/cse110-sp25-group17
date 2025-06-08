/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Service Worker Registration', () => {
  let scriptContents = [];

  beforeAll(() => {
    const filePath = path.resolve(__dirname, '../source/home_page.html');
    const raw = fs.readFileSync(filePath); // buffer
    const html = raw.toString();

    scriptContents = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  });

  test('registers service worker in script', () => {
    const hasSW = scriptContents.some(code =>
      code.includes('navigator.serviceWorker') &&
      code.includes('register("../service-worker.js")')
    );
    expect(hasSW).toBe(true);
  });
});
