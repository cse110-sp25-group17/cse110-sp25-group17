/**
 * @jest-environment node
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('registers service worker in script', () => {
  const filePath = path.resolve(__dirname, '../source/home_page.html');
  const html = fs.readFileSync(filePath, { encoding: 'utf8' });
  const matches = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
  const found = matches.some(([_, script]) =>
    script.includes('navigator.serviceWorker') &&
    script.includes('register("../service-worker.js")')
  );
  expect(found).toBe(true);
});
