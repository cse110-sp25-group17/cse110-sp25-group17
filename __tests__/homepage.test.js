/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Home Page', () => {
  let scriptBlocks = [];
  let buttonOnClicks = [];
  let textContent = '';

  beforeAll(() => {
    const filePath = path.resolve(__dirname, '../source/home_page.html');
    const raw = fs.readFileSync(filePath); // buffer
    const html = raw.toString();

    // Extract <script> content blocks
    scriptBlocks = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);

    // Extract onclick values from buttons (FIXED regex to handle nested quotes)
    buttonOnClicks = [...html.matchAll(/<button[^>]+onclick=(["'])(.*?)\1/gi)].map(m => m[2]);

    // Simple text extraction for visible keywords
    textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  });

  test('contains service worker registration', () => {
    const found = scriptBlocks.some(code =>
      code.includes('navigator.serviceWorker') &&
      code.includes('register("../service-worker.js")')
    );
    expect(found).toBe(true);
  });

  test('contains navigation buttons with expected destinations', () => {
    expect(buttonOnClicks).toEqual(
      expect.arrayContaining([
        "location.href='main_page.html'",
        "location.href='game_page.html'",
        "location.href='collection.html'",
      ])
    );
  });

  test('contains key section labels', () => {
    expect(textContent).toMatch(/Flashcards/i);
    expect(textContent).toMatch(/Quiz Game/i);
    expect(textContent).toMatch(/Collection/i);
  });
});
