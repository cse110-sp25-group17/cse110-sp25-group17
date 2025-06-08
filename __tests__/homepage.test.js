/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Home Page', () => {
  test('includes service worker registration', () => {
    const filePath = path.resolve(__dirname, '../source/home_page.html');
    const html = fs.readFileSync(filePath, 'utf8');

    const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(
      match => match[1]
    );

    const hasSWRegistration = scripts.some(code =>
      code.includes('navigator.serviceWorker') &&
      code.includes('register("../service-worker.js")')
    );

    expect(hasSWRegistration).toBe(true);
  });

  test('includes manifest link', () => {
    const filePath = path.resolve(__dirname, '../source/home_page.html');
    const html = fs.readFileSync(filePath, 'utf8');

    const hasManifest = /<link\s+[^>]*rel=["']manifest["'][^>]*href=["']\.\.\/manifest\.json["'][^>]*>/i.test(html);
    expect(hasManifest).toBe(true);
  });
});
