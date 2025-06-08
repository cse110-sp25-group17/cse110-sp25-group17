/**
 * @jest-environment node
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('includes manifest.json link', () => {
  const filePath = path.resolve(__dirname, '../source/home_page.html');
  const html = fs.readFileSync(filePath, { encoding: 'utf8' });
  expect(html).toMatch(/<link[^>]+rel=["']manifest["'][^>]+href=["']\.\.\/manifest\.json["']/i);
});
