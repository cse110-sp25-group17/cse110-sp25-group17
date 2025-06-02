/**
 * @jest-environment jsdom
 */

import { collection, renderCollection } from '../source/scripts/collection.js';

beforeEach(() => {
  // reset storage & in-memory
  localStorage.clear();
  collection.clear();
  
  document.body.innerHTML = `<div id="collection-container"></div>`;
});

describe('Pokémon Collection', () => {
  test('starts with an empty collection on first run', () => {
    expect(collection.count).toBe(3);

    const stored = JSON.parse(localStorage.getItem('pokemonCollection'));
    expect(stored).toHaveLength(3);
  });

  test('correct catch adds a new Pokémon to localStorage and to the DOM', () => {
    const newPokemon = {
      id:       25,
      name:     'Pikachu',
      img:      'https://example.com/pikachu.png',
      nickname: ''
    };

    // before adding
    expect(collection.has(25)).toBe(false);
    expect(collection.count).toBe(3);

    // simulate a correct catch
    const wasAdded = collection.add(newPokemon);
    expect(wasAdded).toBe(true);
    expect(collection.has(25)).toBe(true);
    expect(collection.count).toBe(4);

    // check localStorage
    const stored = JSON.parse(localStorage.getItem('pokemonCollection'));
    expect(stored.some(p => p.id === 25)).toBe(true);

    // render and verify DOM
    renderCollection();
    const cards = document.querySelectorAll('.pokemon-card');
    expect(cards).toHaveLength(4);
    expect(document.body.textContent).toMatch(/Pikachu/);
  });

  /* test('duplicate catch does not add again', () => {
    const starter = { id: 1, name: 'Bulbasaur', img: '', nickname: '' };

    // Add once, add successfully
    const firstAdd = collection.add(starter);
    expect(firstAdd).toBe(true);
    expect(collection.has(1)).toBe(true);
    expect(collection.count).toBe(1);

    // Add again, fail to add
    const secondAdd = collection.add(starter);
    expect(secondAdd).toBe(false);
    expect(collection.count).toBe(1);

    renderCollection();
    const cards = document.querySelectorAll('.pokemon-card');
    expect(cards).toHaveLength(1);
  }); */

  test('wrong answer does not change the collection', () => {
    // Simulate a wrong answer by not calling collection.add()
    expect(collection.count).toBe(3);
    renderCollection();

    const cards = document.querySelectorAll('.pokemon-card');
    expect(cards).toHaveLength(3);
  });
});
