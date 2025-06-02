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

//testing the game loop (it seems to be lagging a bit)
test('game loop loads new Pokémon after clicking a button', async () => {
  await loadPokemon();
  const buttons = Array.from(document.querySelectorAll('#options button'));


  // click the first button
  buttons[0].click();

  // wait for the next Pokémon to load
  await new Promise((r) => setTimeout(r, 1600));

  // check that a new Pokémon is loaded
  const img = document.getElementById('pokemon-img');
  expect(img.src).toContain('pikachu.png'); // this should be replaced by the next Pokémon's image
});

//testing the behavior of clicking (diable the buttons after clicking and wait for next card)
test('after clicking a button, all buttons are disabled', async () => {
  await loadPokemon();
  const buttons = Array.from(document.querySelectorAll('#options button'));

  // click the first button
  buttons[0].click();

  // check that all buttons are disabled
  expect(buttons.every(b => b.disabled)).toBe(true);

  // and the result message should be visible
  const msg = document.getElementById('result-msg');
  expect(msg.textContent).toMatch(/correct|oops/i);
});


//testing the transition to the next stage after clicking the correct type button
test('after correct type, game asks for name', async () => {
  await loadPokemon();
  const buttons = Array.from(document.querySelectorAll('#options button'));

  // click the correct type button
  const correctBtn = buttons.find(b => b.textContent.toLowerCase() === 'electric');
  correctBtn.click();

  // wait for the transition to name question
  await new Promise((r) => setTimeout(r, 1600));

  const msg = document.getElementById('result-msg');
  expect(msg.textContent).toMatch(/what's the name of this pokémon/i);

  // and check that 4 name buttons are present
  const nameButtons = document.querySelectorAll('#options button');
  expect(nameButtons).toHaveLength(4);
});
