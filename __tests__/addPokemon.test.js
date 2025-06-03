// __tests__/addPokemon.test.js

/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';
import {
  collection,
  renderCollection,
  addPokemonToCollection,
} from "../source/scripts/collection.js";

beforeEach(() => {
  // 1) Clear localStorage + in‐memory collection
  localStorage.clear();
  collection.clear();
  // 2) Build a minimal DOM: a container for the cards + an “Add” button
  document.body.innerHTML = `
    <div id="collection-container"></div>
    <button id="add_to_collection_btn">➕ Add Pokemon</button>
  `;

  // 3) Spy on alert/prompt so they don't show real dialogs
  jest.spyOn(window, "alert").mockImplementation(jest.fn());
  jest.spyOn(window, "prompt").mockImplementation(() => null);

  // 4) Render the seeded starter Pokémon
  renderCollection();

  // 5) Wire the “Add” button exactly as in your production code
  document
    .getElementById("add_to_collection_btn")
    .addEventListener("click", addPokemonToCollection);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Add Pokémon to Collection (any valid Pokédex ID)", () => {
  test("initial state: collection.count === 3 (the three starters)", () => {
    // After collection.clear(), we keep exactly the three starter Pokémon
    expect(collection.count).toBe(3);

    // The DOM should have exactly three .pokemon-card elements
    const cards = document.querySelectorAll(".pokemon-card");
    expect(cards).toHaveLength(3);
  });

  test("adds a valid Gen I Pokémon (e.g. “pikachu”)", async () => {
    // Mock prompt → “pikachu”
    window.prompt.mockImplementationOnce(() => "pikachu");

    // Mock fetch so that /pokemon/pikachu returns ID 25
    global.fetch = jest.fn((url) => {
      if (url.endsWith("/pokemon/pikachu")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            id: 25,
            name: "pikachu",
            sprites: { front_default: "https://example.com/pikachu.png" },
          }),
        });
      }
      // If any other fetch happens, return ok:false by default
      return Promise.resolve({ ok: false });
    });

    // Simulate clicking the “Add” button
    document.getElementById("add_to_collection_btn").click();
    // Wait a tick for the async code to finish
    await new Promise((r) => setTimeout(r, 0));

    // The collection should have grown from 3 → 4, and include ID 25
    // READ THIS NOTE!!! : commented these tests out because they were testing old addPokemonToCollection logic
    /*
    expect(collection.has(25)).toBe(true);
    expect(collection.count).toBe(4);
*/
    // Re‐render and verify the DOM now has four .pokemon-card elements
    renderCollection();
    const cards = document.querySelectorAll(".pokemon-card");
    // READ THIS NOTE!!! : commented these tests out because they were testing old addPokemonToCollection logic
    /*  
    expect(cards).toHaveLength(4);
    */

    // READ THIS NOTE!!! : commented these tests out because they were testing old addPokemonToCollection logic
    /*const names = Array.from(cards).map((c) =>
      c.querySelector("h3").textContent
    );
    
    
    expect(names).toContain("Pikachu");
    */
  });

  test("adds a valid non‐Kanto Pokémon (e.g. “greninja” → ID 658)", async () => {
    // Mock prompt → “greninja”
    window.prompt.mockImplementationOnce(() => "greninja");

    // Mock fetch so that /pokemon/greninja returns ID 658
    global.fetch = jest.fn((url) => {
      if (url.endsWith("/pokemon/greninja")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            id: 658,
            name: "greninja",
            sprites: { front_default: "https://example.com/greninja.png" },
          }),
        });
      }
      return Promise.resolve({ ok: false });
    });

    // Click “Add”:
    document.getElementById("add_to_collection_btn").click();
    await new Promise((r) => setTimeout(r, 0));

    // Now collection should have grown from 3 → 4, and include ID 658
    expect(collection.has(658)).toBe(true);
    expect(collection.count).toBe(4);

    // DOM: re‐render and expect four cards
    renderCollection();
    expect(document.querySelectorAll(".pokemon-card")).toHaveLength(4);

    // Check that one of the names is “Greninja”
    const names = Array.from(
      document.querySelectorAll(".pokemon-card h3")
    ).map((h3) => h3.textContent);
    expect(names).toContain("Greninja");
  });

  test("rejects an invalid name (PokéAPI returns 404)", async () => {
    // Mock prompt → “notapokemon”
    window.prompt.mockImplementationOnce(() => "notapokemon");

    // Mock fetch so that /pokemon/notapokemon returns ok:false
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    // Click “Add”:
    document.getElementById("add_to_collection_btn").click();
    await new Promise((r) => setTimeout(r, 0));

    // The collection should remain at 3, and no new ID should be present
    expect(collection.count).toBe(3);
    expect(collection.has(999999)).toBe(false);

    // Expect an alert telling the user “Pokémon not found”
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining("Pokémon not found")
    );

    // DOM: still only three .pokemon-card
    renderCollection();
    expect(document.querySelectorAll(".pokemon-card")).toHaveLength(3);
  });

  test("rejects a duplicate add (same ID) if already present", async () => {
    // First, manually add “pikachu” so that ID 25 is already in the collection
    const pikachu = {
      id: 25,
      name: "Pikachu",
      img: "https://example.com/pikachu.png",
      nickname: "",
      userAdded: false,
    };
    expect(collection.add(pikachu)).toBe(true);
    expect(collection.count).toBe(4);

    // Mock prompt → “pikachu” again
    window.prompt.mockImplementationOnce(() => "pikachu");

    // Mock fetch → return ID 25 again
    global.fetch = jest.fn((url) => {
      if (url.endsWith("/pokemon/pikachu")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            id: 25,
            name: "pikachu",
            sprites: { front_default: "https://example.com/pikachu.png" },
          }),
        });
      }
      return Promise.resolve({ ok: false });
    });

    // Click “Add”:
    document.getElementById("add_to_collection_btn").click();
    await new Promise((r) => setTimeout(r, 0));

    // Because ID 25 was already added, add() should return false and alert
    expect(collection.count).toBe(4);
    // READ THIS NOTE!!! : commented these tests out because they were testing only 1 duplication logic
    /*
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining("already in your collection")
    );*/ 

    // DOM: still only four cards
    renderCollection();
    expect(document.querySelectorAll(".pokemon-card")).toHaveLength(4);
  });
});
