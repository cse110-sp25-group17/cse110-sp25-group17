/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('home_page.html', () => {
  beforeAll(() => {
    const filePath = path.resolve(__dirname, '../source/home_page.html');
    const html = fs.readFileSync(filePath).toString('utf8'); // Safer than using 'utf8' in the second param

    // Inject safely into a temporary container (not whole document)
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
  });

  it('includes a manifest link', () => {
    const manifest = document.querySelector('link[rel="manifest"]');
    expect(manifest).not.toBeNull();
    expect(manifest.getAttribute('href')).toBe('../manifest.json');
  });

  it('registers the service worker', () => {
    const scripts = Array.from(document.scripts).map(s => s.textContent || '');
    const hasSWRegistration = scripts.some(code =>
      code.includes('navigator.serviceWorker') &&
      code.includes('register("../service-worker.js")')
    );
    expect(hasSWRegistration).toBe(true);
  });

  it('has Flashcards, Game, and Collection sections', () => {
    expect(document.body.textContent).toMatch(/Flashcards/);
    expect(document.body.textContent).toMatch(/Quiz Game/);
    expect(document.body.textContent).toMatch(/Collection/);
  });

  it('has navigation buttons with correct destinations', () => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const destinations = buttons.map(btn => btn.getAttribute('onclick'));
    expect(destinations).toContain("location.href='main_page.html'");
    expect(destinations).toContain("location.href='game_page.html'");
    expect(destinations).toContain("location.href='collection.html'");
  });
});
