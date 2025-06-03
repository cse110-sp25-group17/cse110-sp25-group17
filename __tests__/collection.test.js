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

  test('shows empty message if no Pokémon in collection', () => {
    expect(collection.count).toBe(0);
    renderCollection();
  
    const container = document.getElementById('collection-container');
    expect(container.textContent).toContain("You don't have any Pokémon yet");
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
    expect(collection.count).toBe(2);

    renderCollection();

    const cards = document.querySelectorAll('.pokemon-card');
    expect(cards).toHaveLength(2);

    const displayedNames = Array.from(cards).flatMap(card => {
      const name = card.querySelector('h3')?.textContent ?? '';
      const nickname = card.querySelector('.nickname')?.textContent.replace(/[()]/g, '') ?? '';
      return [name, nickname].filter(Boolean); // removes empty strings
    });
    // Should include the un-nicknamed 'Pikachu' and the nickname 'Jiggly'
    expect(displayedNames).toEqual(
      expect.arrayContaining(['Pikachu', 'Jiggly'])
    );
  });

  test('clear() resets collection back to empty deck', () => {
    // Add and then clear
    collection.add({
      id:       25,
      name:     'Pikachu',
      img:      'pikachu.png',
      nickname: ''
    });
    expect(collection.count).toBe(1);

    collection.clear();
    expect(collection.count).toBe(0);

    renderCollection();
    const cards = document.querySelectorAll('.pokemon-card');
    expect(cards).toHaveLength(0);
  });
});

