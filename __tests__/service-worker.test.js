/**
 * @jest-environment jsdom
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

    // Extract script content directly using regex (safe and no innerHTML)
    const scriptBlocks = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(
      match => match[1]
    );

    const hasSWRegistration = scriptBlocks.some(code =>
      code.includes('navigator.serviceWorker') &&
      code.includes('register("../service-worker.js")')
    );

    expect(hasSWRegistration).toBe(true);
  });
});
