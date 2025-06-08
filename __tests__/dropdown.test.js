/**
 * @jest-environment jsdom
 */

import { renderTypeFilter, collection } from '../source/scripts/collection.js';

describe('Type Filter Dropdown', () => {
  beforeEach(() => {
    // Set up our document body
    document.body.innerHTML = `
      <select id="type-filter">
        <option value="all">All Types</option>
      </select>
    `;

    // Mock the collection.all property
    Object.defineProperty(collection, 'all', {
      get: () => [
        { id: 1, name: 'Bulbasaur', type: 'grass' },
        { id: 4, name: 'Charmander', type: 'fire' },
        { id: 7, name: 'Squirtle', type: 'water' }
      ],
      configurable: true
    });
  });

  afterEach(() => {
    // Restore the original property
    delete collection.all;
  });

  it('populates the dropdown with unique types from the collection', () => {
    renderTypeFilter();
    const select = document.getElementById('type-filter');
    const options = Array.from(select.options).map(opt => opt.value);

    expect(options).toContain('all');
    expect(options).toContain('grass');
    expect(options).toContain('fire');
    expect(options).toContain('water');
    expect(options).toContain('favorites');
    expect(options.length).toBe(5); // all + 3 types
  });
});