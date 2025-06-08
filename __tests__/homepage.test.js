/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('home_page.html', () => {
  let container;

  beforeAll(() => {
    const filePath = path.resolve(__dirname, '../source/home_page.html');
    const html = fs.readFileSync(filePath, 'utf8');

    container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
  });

  afterAll(() => {
    document.body.innerHTML = ''; // Clean up
  });

  test('includes a manifest link with correct href', () => {
    const manifest = document.querySelector('link[rel="manifest"]');
    expect(manifest?.getAttribute('href')).toBe('../manifest.json');
  });

  test('includes service worker registration code', () => {
    const scripts = container.querySelectorAll('script');
    const hasRegistration = [...scripts].some(script =>
      script.textContent?.includes('navigator.serviceWorker') &&
      script.textContent.includes('register("../service-worker.js")')
    );
    expect(hasRegistration).toBe(true);
  });

  test('contains expected section labels', () => {
    const text = container.textContent;
    expect(text).toMatch(/Flashcards/);
    expect(text).toMatch(/Quiz Game/);
    expect(text).toMatch(/Collection/);
  });

  test('contains navigation buttons with expected onclick destinations', () => {
    const destinations = [...container.querySelectorAll('button')].map(btn =>
      btn.getAttribute('onclick')
    );
    expect(destinations).toEqual(
      expect.arrayContaining([
        "location.href='main_page.html'",
        "location.href='game_page.html'",
        "location.href='collection.html'",
      ])
    );
  });
});
