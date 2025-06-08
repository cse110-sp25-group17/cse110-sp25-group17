/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Service Worker Registration', () => {
  it('registers the service worker in home_page.html', () => {
    const html = fs.readFileSync(path.resolve(__dirname, '../source/home_page.html'), 'utf8');

    // Securely parse HTML to avoid XSS warning
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    document.documentElement.replaceWith(doc.documentElement);

    const scripts = Array.from(document.scripts).map(s => s.textContent);
    const hasSWRegistration = scripts.some(code =>
      code.includes('navigator.serviceWorker') &&
      code.includes('register("../service-worker.js")')
    );
    expect(hasSWRegistration).toBe(true);
  });
});
