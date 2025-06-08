/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Manifest Link in Home Page', () => {
  let hasManifest = false;

  beforeAll(() => {
    const filePath = path.resolve(__dirname, '../source/home_page.html');
    const raw = fs.readFileSync(filePath); // buffer
    const html = raw.toString(); // decode later

    hasManifest = html.includes(`rel="manifest"`) &&
                  html.includes(`href="../manifest.json"`);
  });

  test('includes manifest.json link tag', () => {
    expect(hasManifest).toBe(true);
  });
});
