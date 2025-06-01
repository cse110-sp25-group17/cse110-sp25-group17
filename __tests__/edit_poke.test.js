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
  test('loads and displays Pikachu for ?id=25, then editing nickname', () => {
    // simulate visiting edit_page.html?id=25
    Object.defineProperty(window, 'location', {
      value: { search: '?id=25', href: '', assign(url) { this.href = url; } }
    });

    // Trigger the DOMContentLoaded handler in edit.js
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Check that the card container now has an img and h3
    const img = document.querySelector('#card-container img');
    const h3  = document.querySelector('#card-container h3');
    expect(img).not.toBeNull();
    expect(img.src).toContain('pikachu.png');
    expect(h3.textContent).toBe('Pikachu');

    // Mock prompt to return “Sparky” when editing nickname
    jest.spyOn(window, 'prompt').mockReturnValue('Sparky');
    document.getElementById('nickname-btn').click();

    // After clicking, script should redirect to collection.html
    expect(window.location.href).toBe('collection.html');

    // Confirm localStorage now stores the nickname “Sparky”
    const stored = JSON.parse(localStorage.getItem('pokemonCollection'));
    expect(stored.find(p => p.id === 25).nickname).toBe('Sparky');
    window.prompt.mockRestore();
  });

  test('deletes Pikachu and redirects back', () => {
    // Simulate visiting edit_page.html?id=25
    Object.defineProperty(window, 'location', {
      value: { search: '?id=25', href: '', assign(url) { this.href = url; } }
    });
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Click the Delete button
    document.getElementById('delete-btn').click();

    // Should redirect to collection.html and remove Pikachu from collection
    expect(window.location.href).toBe('collection.html');
    expect(collection.has(25)).toBe(false);
  });

  test('invalid id shows “not found” and hides Delete/Nickname, Back works', () => {
    // Simulate visiting edit_page.html?id=999 (not in collection)
    Object.defineProperty(window, 'location', {
      value: { search: '?id=999', href: '', assign(url) { this.href = url; } }
    });
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Expect the container to display a “not found” message
    const message = document.querySelector('#card-container h2') ||
                    document.querySelector('#card-container h3');
    expect(message.textContent).toMatch(/not found/i);

    // Delete and Nickname buttons should be hidden by JS (style.display = 'none')
    expect(document.getElementById('delete-btn').style.display).toBe('none');
    expect(document.getElementById('nickname-btn').style.display).toBe('none');

    // Clicking Back should redirect to collection.html
    document.getElementById('back-btn').click();
    expect(window.location.href).toBe('collection.html');
  });

  test('no id parameter also shows “not found” message', () => {
    // Simulate visiting edit_page.html with no query string
    Object.defineProperty(window, 'location', {
      value: { search: '', href: '', assign(url) { this.href = url; } }
    });
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Should see the “not found” heading in the container
    const message = document.querySelector('#card-container h2');
    expect(message.textContent).toMatch(/not found/i);
  });
});

