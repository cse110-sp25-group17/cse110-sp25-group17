/**
 * @jest-environment jsdom
 */

import { loadPokemon } from '../source/scripts/game.js';
import { collection, renderCollection } from '../source/scripts/collection.js';
import { jest } from '@jest/globals';

beforeEach(() => {
  // reset DOM
  document.body.innerHTML = `
    <img id="pokemon-img" />
    <div id="options"></div>
    <p id="result-msg"></p>
    <div id="collection-container"></div>
  `;

  // reset storage & in-memory
  localStorage.clear();
  collection.clear();

  // test fetch for loadPokemon to return a known Pokémon
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({
      id: 25,
      name: 'pikachu',
      sprites: { front_default: 'pikachu.png' },
      types: [{ type: { name: 'electric' } }]
    })
  });
});

test('each question renders exactly 4 buttons: 1 correct + 3 wrong', async () => {
  await loadPokemon();       // this calls generateOptions internally
  const buttons = document.querySelectorAll('#options button');
  expect(buttons).toHaveLength(4);

  const texts = Array.from(buttons).map(b => b.textContent.toLowerCase());
  // exactly one 'electric'
  expect(texts.filter(t => t === 'electric')).toHaveLength(1);
  // exactly three not 'electric'
  expect(texts.filter(t => t !== 'electric')).toHaveLength(3);
});

test('clicking the correct button shows “Correct!” and adds to collection', async () => {
  await loadPokemon();
  const buttons = Array.from(document.querySelectorAll('#options button'));

  // find and click the correct one
  const correctBtn = buttons.find(b => b.textContent.toLowerCase() === 'electric');
  correctBtn.click();

  // immediate feedback
  const msg = document.getElementById('result-msg');
  expect(msg.textContent).toMatch(/correct!/i);

  // and it should be in the collection
  expect(collection.has(25)).toBe(true);

  // if you renderCollection, you should see a card
  renderCollection();
  expect(document.querySelectorAll('.pokemon-card')).toHaveLength(4); 
});

test('clicking an incorrect button shows “Oops” and does NOT add to collection', async () => {
  await loadPokemon();
  const buttons = Array.from(document.querySelectorAll('#options button'));

  // pick any wrong one
  const wrongBtn = buttons.find(b => b.textContent.toLowerCase() !== 'electric');
  wrongBtn.click();

  const msg = document.getElementById('result-msg');
  expect(msg.textContent).toMatch(/oops/i);

  // no new catch
  expect(collection.has(25)).toBe(false);
  expect(collection.count).toBe(3);
});
