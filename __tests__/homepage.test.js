/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('home_page.html basic features', () => {
  let html;

  beforeAll(() => {
    const filePath = path.resolve(__dirname, '../source/home_page.html'); // adjust path as needed
    html = fs.readFileSync(filePath, 'utf8');
    document.documentElement.innerHTML = html;
  });

  test('page has correct title', () => {
    expect(document.title).toBe('Pokémon Learning Hub');
  });

  test('displays main heading', () => {
    const heading = document.querySelector('h1');
    expect(heading).not.toBeNull();
    expect(heading.textContent).toMatch(/Pokémon Learning Hub/i);
  });

  test('contains all 3 section buttons with correct text', () => {
    const buttons = [...document.querySelectorAll('button')].map(btn => btn.textContent.trim());
    expect(buttons).toContain('Go to Flashcards');
    expect(buttons).toContain('Go to Game');
    expect(buttons).toContain('Go to Collection');
  });

  test('contains correct number of images with expected alt texts', () => {
    const images = document.querySelectorAll('img');
    const alts = Array.from(images).map(img => img.alt);
    expect(alts).toContain('Pokemon Logo');
    expect(alts).toContain('Flashcards Preview');
    expect(alts).toContain('Quiz Preview');
    expect(alts).toContain('Collection Preview');
  });

  test('has valid manifest link', () => {
    const manifestLink = document.querySelector('link[rel="manifest"]');
    expect(manifestLink).not.toBeNull();
    expect(manifestLink.getAttribute('href')).toBe('../manifest.json');
  });
});
