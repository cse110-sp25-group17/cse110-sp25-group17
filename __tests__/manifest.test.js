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
    const html = fs.readFileSync(filePath, 'utf8');

    // Extract inline script contents using regex instead of assigning to innerHTML
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    scriptContents = [...html.matchAll(scriptRegex)].map(match => match[1]);
  });

  test('registers the service worker in home_page.html', () => {
    const hasSWRegistration = scriptContents.some(code =>
      code.includes('navigator.serviceWorker') &&
      code.includes('register("../service-worker.js")')
    );
    expect(hasSWRegistration).toBe(true);
  });
});
