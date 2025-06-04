/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';
import { collection } from '../source/scripts/collection.js';
import '../source/scripts/edit_page.js';

beforeEach(() => {
  // Clear storage and start fresh with Pikachu (id=25)
  localStorage.clear();
  collection.clear();
  collection.add({
    id:       25,
    name:     'Pikachu',
    img:      'pikachu.png',
    nickname: ''
  });

  // simulate the Edit page HTML structure
  document.body.innerHTML = `
    <div class="header"></div>
    <div id="card-container"></div>
    <div id="buttons">
      <button id="delete-btn">Delete</button>
      <button id="nickname-btn">Nickname</button>
      <button id="back-btn">Back</button>
    </div>
  `;

  // test window.location so we can inspect href instead of real navigation
  delete window.location;
  window.location = {
    href: '',
    assign(url) { this.href = url; }
  };
});

describe('Edit page behavior', () => {
  // ... other tests above ...

  test('nickname identical to original name is rejected', () => {
    // Simulate visiting edit_page.html?id=25
    Object.defineProperty(window, 'location', {
      value: { search: '?id=25', href: '', assign(url) { this.href = url; } }
    });

    // Trigger DOMContentLoaded
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Set nickname prompt to the same name (case-insensitive)
    jest.spyOn(window, 'prompt').mockReturnValue('pikachu');
    document.getElementById('nickname-btn').click();

    // Should not redirect to collection.html
    expect(window.location.href).not.toBe('collection.html');

    // Nickname should remain unchanged
    const stored = JSON.parse(localStorage.getItem('pokemonCollection'));
    expect(stored.find(p => p.id === 25).nickname).toBe('');

    window.prompt.mockRestore();
  });
});
