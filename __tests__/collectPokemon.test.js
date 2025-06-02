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
  test('seeds with 3 starters on first run', () => {
    // initially we should have Bulbasaur, Charmander, Squirtle
    expect(collection.count).toBe(3);

    const stored = JSON.parse(localStorage.getItem('pokemonCollection'));
    expect(stored).toHaveLength(3);
    const names = stored.map(p => p.name);
    expect(names).toEqual(expect.arrayContaining(['Bulbasaur','Charmander','Squirtle']));

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

  test('duplicate catch does not add again', () => {
    const starter = { id: 1, name: 'Bulbasaur', img: '', nickname: '' };
    expect(collection.has(1)).toBe(true);

    // Attempt to add the same ID again
    const wasAdded = collection.add(starter);
    expect(wasAdded).toBe(false);
    // Count stays the same
    expect(collection.count).toBe(3);

    renderCollection();
    const cards = document.querySelectorAll('.pokemon-card');
    expect(cards).toHaveLength(3);
  });

  test('wrong answer does not change the collection', () => {
    // Simulate a wrong answer by not calling collection.add()
    expect(collection.count).toBe(3);
    renderCollection();

    const cards = document.querySelectorAll('.pokemon-card');
    expect(cards).toHaveLength(3);
  });
});
