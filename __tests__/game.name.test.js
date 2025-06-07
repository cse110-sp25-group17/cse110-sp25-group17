/**
 * @jest-environment jsdom
 */

import { loadPokemon } from "../source/scripts/game.js";
import { collection, renderCollection } from "../source/scripts/collection.js";
import { jest } from "@jest/globals";

beforeEach(() => {
  document.body.innerHTML = `
     <h2></h2>
     <img id="pokemon-img" />
     <div id="options"></div>
     <p id="result-msg"></p>
     <div id="collection-container"></div>
   `;
  localStorage.clear();
  collection.clear();

  global.fetch = jest.fn((url) => {
    if (url.includes("/pokemon?limit=151")) {
      return Promise.resolve({
        json: async () => ({
          results: [
            { name: "bulbasaur" },
            { name: "charmander" },
            { name: "squirtle" },
            { name: "pikachu" },
          ],
        }),
      });
    } else {
      return Promise.resolve({
        json: async () => ({
          id: 25,
          name: "pikachu",
          sprites: { front_default: "pikachu.png" },
          types: [{ type: { name: "electric" } }],
        }),
      });
    }
  });
});

test("adds Pokémon to collection after correct name guess", async () => {
  await loadPokemon();
  const typeBtns = Array.from(document.querySelectorAll("#options button"));
  const correctTypeBtn = typeBtns.find(
    (b) => b.textContent.toLowerCase() === "electric"
  );
  correctTypeBtn.click();

  await new Promise((r) => setTimeout(r, 1600));

  const nameBtns = Array.from(document.querySelectorAll("#options button"));
  const correctNameBtn = nameBtns.find(
    (b) => b.textContent.toLowerCase() === "pikachu"
  );
  correctNameBtn.click();

  await new Promise((r) => setTimeout(r, 2000));
  expect(collection.has(25)).toBe(true);

  renderCollection();
  expect(document.querySelectorAll(".pokemon-card")).toHaveLength(4);
});

test("guessing the wrong name shows “Oops” and does NOT add to collection", async () => {
  await loadPokemon();

  const typeButtons = Array.from(document.querySelectorAll("#options button"));
  const correctTypeBtn = typeButtons.find(
    (b) => b.textContent.toLowerCase() === "electric"
  );
  correctTypeBtn.click();

  await new Promise((r) => setTimeout(r, 1600));

  const nameButtons = Array.from(document.querySelectorAll("#options button"));
  const wrongNameBtn = nameButtons.find(
    (b) => b.textContent.toLowerCase() !== "pikachu"
  );
  wrongNameBtn.click();

  const msg = document.getElementById("result-msg");
  expect(msg.textContent.toLowerCase()).toMatch(/oops/i);
  expect(collection.has(25)).toBe(false);
  expect(collection.count).toBe(3);
});
