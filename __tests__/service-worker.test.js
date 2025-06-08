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
    // Read HTML file as Buffer and convert to string
    const filePath = path.resolve(__dirname, '../source/home_page.html');
    const htmlContent = fs.readFileSync(filePath).toString('utf8');

    // Create a temporary container div instead of replacing the full document
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    const scripts = Array.from(container.querySelectorAll('script')).map(s => s.textContent || '');
    const hasSWRegistration = scripts.some(code =>
      code.includes('navigator.serviceWorker') &&
      code.includes('register("../service-worker.js")')
    );
    expect(hasSWRegistration).toBe(true);
  });
});
