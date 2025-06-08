/**
 * @jest-environment node
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Home Page', () => {
  let html = '';

  beforeAll(() => {
    const filePath = path.resolve(__dirname, '../source/home_page.html');
    html = fs.readFileSync(filePath, { encoding: 'utf8' });
  });

  test('has navigation buttons with correct destinations', () => {
    expect(html).toMatch(/onclick=["']location\.href='main_page\.html'["']/);
    expect(html).toMatch(/onclick=["']location\.href='game_page\.html'["']/);
    expect(html).toMatch(/onclick=["']location\.href='collection\.html'["']/);
  });

  test('has section headers', () => {
    expect(html).toMatch(/Flashcards/i);
    expect(html).toMatch(/Quiz Game/i);
    expect(html).toMatch(/Collection/i);
  });
});
