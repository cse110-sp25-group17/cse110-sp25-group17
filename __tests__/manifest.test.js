/**
 * @jest-environment node
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Manifest Link', () => {
  test('contains a valid manifest.json link in home_page.html', () => {
    const filePath = path.resolve(__dirname, '../source/home_page.html');
    const html = fs.readFileSync(filePath, 'utf8');
    const hasManifest = /<link\s+[^>]*rel=["']manifest["'][^>]*href=["']\.\.\/manifest\.json["'][^>]*>/i.test(html);
    expect(hasManifest).toBe(true);
  });
});
