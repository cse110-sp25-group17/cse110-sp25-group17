/**
 * @jest-environment jsdom
 */

import { collection, renderCollection } from '../source/scripts/collection.js';

beforeEach(() => {
  // reset storage & in-memory
  localStorage.clear();
  collection.clear();

  // create a fresh DOM container for renderCollection()
  document.body.innerHTML = `<div id="collection-container"></div>`;
});

describe('collection rendering', () => {

  test('renders seeded starters on first load', () => {

    expect(collection.count).toBe(3);
    renderCollection();

    const cards = document.querySelectorAll('.pokemon-card');
    expect(cards).toHaveLength(3);

    const names = Array.from(cards).map(card =>
      card.querySelector('h3').textContent
    );
    expect(names).toEqual(
      expect.arrayContaining(['Bulbasaur', 'Charmander', 'Squirtle'])
    );
  });

  test('renders every Pokémon currently in localStorage, using nicknames when set', () => {
    // simulate catching two more Pokémon, one with a nickname
    collection.add({
      id:       25,
      name:     'Pikachu',
      img:      'https://example.com/pikachu.png',
      nickname: ''
    });
    collection.add({
      id:       39,
      name:     'Jigglypuff',
      img:      'https://example.com/jigglypuff.png',
      nickname: 'Jiggly'
    });

    // Now there should be 5 total
    expect(collection.count).toBe(5);

    renderCollection();

    const cards = document.querySelectorAll('.pokemon-card');
    expect(cards).toHaveLength(5);

    const displayedNames = Array.from(cards).map(card =>
      card.querySelector('h3').textContent
    );
    // Should include the un-nicknamed 'Pikachu' and the nickname 'Jiggly'
    expect(displayedNames).toEqual(
      expect.arrayContaining(['Pikachu', 'Jiggly'])
    );
  });

  test('clear() resets collection back to 3 cards', () => {
    // Add and then clear
    collection.add({
      id:       25,
      name:     'Pikachu',
      img:      'pikachu.png',
      nickname: ''
    });
    expect(collection.count).toBe(4);

    collection.clear();
    expect(collection.count).toBe(3);

    renderCollection();
    const cards = document.querySelectorAll('.pokemon-card');
    expect(cards).toHaveLength(3);
  });
});
