/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Service Worker Registration', () => {
  let container;

  beforeAll(() => {
    const filePath = path.resolve(__dirname, '../source/home_page.html');
    const html = fs.readFileSync(filePath, 'utf8');

    container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
  });

  afterAll(() => {
    document.body.innerHTML = '';
  });

  test('home_page.html registers the service worker', () => {
    const scripts = Array.from(container.querySelectorAll('script'));
    const hasRegistration = scripts.some(script =>
      script.textContent?.includes('navigator.serviceWorker') &&
      script.textContent.includes('register("../service-worker.js")')
    );

    expect(hasRegistration).toBe(true);
  });
});
