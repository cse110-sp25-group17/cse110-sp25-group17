/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Service Worker Registration', () => {
  let doc;

  beforeAll(() => {
    const filePath = path.resolve(__dirname, '../source/home_page.html');

    // Safely isolate HTML load
    const htmlBuffer = fs.readFileSync(filePath);
    const html = htmlBuffer.toString('utf8');

    // Simulate DOM only in test context
    const parser = new DOMParser();
    doc = parser.parseFromString(html, 'text/html');

    // Avoid direct DOM replacement unless necessary
    document.body.innerHTML = doc.body.innerHTML;
  });

  it('registers the service worker in home_page.html', () => {
    const scripts = Array.from(document.scripts).map(s => s.textContent || '');
    const hasSWRegistration = scripts.some(code =>
      code.includes('navigator.serviceWorker') &&
      code.includes('register("../service-worker.js")')
    );
    expect(hasSWRegistration).toBe(true);
  });
});
