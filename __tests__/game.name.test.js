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

  // test fetch for loadPokemon to return a known Pokémon (mock fetch)
  global.fetch = jest.fn((url) => {
    if (url.includes('/pokemon?limit=151')) {
      // Mock for generateNameOptions() - name guessing stage
      return Promise.resolve({
        json: async () => ({
          results: [
            { name: 'bulbasaur' },
            { name: 'charmander' },
            { name: 'squirtle' },
            { name: 'pikachu' }
          ]
        })
      });
    } else {
      // Mock for loadPokemon() - single Pokémon
      return Promise.resolve({
        json: async () => ({
          id: 25,
          name: 'pikachu',
          sprites: { front_default: 'pikachu.png' },
          types: [{ type: { name: 'electric' } }]
        })
      });
    }
  });
});


test('adds Pokémon to collection after correct name guess', async () => {
  await loadPokemon();
  const typeBtns = Array.from(document.querySelectorAll('#options button'));
  const correctTypeBtn = typeBtns.find(b => b.textContent.toLowerCase() === 'electric');
  correctTypeBtn.click();

  await new Promise((r) => setTimeout(r, 1600));

  const nameBtns = Array.from(document.querySelectorAll('#options button'));
  const correctNameBtn = nameBtns.find(b => b.textContent.toLowerCase() === 'pikachu');
  correctNameBtn.click();

  // wait for collection update
  await new Promise((r) => setTimeout(r, 2000));
  //add card to collection
  expect(collection.has(25)).toBe(true);

  //should have 4 cards
  renderCollection();
  expect(document.querySelectorAll('.pokemon-card')).toHaveLength(4);
});

//wrong button for name
test('guessing the wrong name shows “Oops” and does NOT add to collection', async () => {
  await loadPokemon();

  //correct type 
  const typeButtons = Array.from(document.querySelectorAll('#options button'));
  const correctTypeBtn = typeButtons.find(b => b.textContent.toLowerCase() === 'electric');
  correctTypeBtn.click();

  await new Promise((r) => setTimeout(r, 1600));

  //wrong name
  const nameButtons = Array.from(document.querySelectorAll('#options button'));
  const wrongNameBtn = nameButtons.find(b => b.textContent.toLowerCase() !== 'pikachu');
  wrongNameBtn.click();

  const msg = document.getElementById('result-msg');
  expect(msg.textContent.toLowerCase()).toMatch(/oops/i);

  //don't add to collection
  expect(collection.has(25)).toBe(false);
  expect(collection.count).toBe(3);
});

