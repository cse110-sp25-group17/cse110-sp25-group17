/**
 * @jest-environment node
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Service Worker Registration', () => {
  test('registers the service worker in home_page.html', () => {
    const filePath = path.resolve(__dirname, '../source/home_page.html');
    const html = fs.readFileSync(filePath, 'utf8');
    const scriptContents = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
    const hasSWRegistration = scriptContents.some(code =>
      code.includes('navigator.serviceWorker') &&
      code.includes('register("../service-worker.js")')
    );
    expect(hasSWRegistration).toBe(true);
  });
});
