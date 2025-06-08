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
    const filePath = path.resolve(__dirname, '../source/home_page.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const scripts = Array.from(doc.querySelectorAll('script')).map(
      (s) => s.textContent || ''
    );

    const hasSWRegistration = scripts.some((code) =>
      code.includes('navigator.serviceWorker') &&
      code.includes('register("../service-worker.js")')
    );

    expect(hasSWRegistration).toBe(true);
  });
});
