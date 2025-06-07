/**
 * @jest-environment jsdom
 */

import { loadPokemon } from "../source/scripts/game.js";
import { collection } from "../source/scripts/collection.js";
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

test("each question renders exactly 4 buttons: 1 correct + 3 wrong", async () => {
  await loadPokemon();
  const buttons = document.querySelectorAll("#options button");
  expect(buttons).toHaveLength(4);

  const texts = Array.from(buttons).map((b) => b.textContent.toLowerCase());
  expect(texts.filter((t) => t === "electric")).toHaveLength(1);
  expect(texts.filter((t) => t !== "electric")).toHaveLength(3);
});

test("clicking an incorrect button shows “Oops” and does NOT add to collection", async () => {
  await loadPokemon();
  const buttons = Array.from(document.querySelectorAll("#options button"));
  const wrongBtn = buttons.find(
    (b) => b.textContent.toLowerCase() !== "electric"
  );
  wrongBtn.click();

  const msg = document.getElementById("result-msg");
  expect(msg.textContent).toMatch(/oops/i);

  expect(collection.has(25)).toBe(false);
  expect(collection.count).toBe(3);
});

test("game loop loads new Pokémon after clicking a button", async () => {
  await loadPokemon();
  const buttons = Array.from(document.querySelectorAll("#options button"));
  buttons[0].click();

  await new Promise((r) => setTimeout(r, 1600));
  const img = document.getElementById("pokemon-img");
  expect(img.src).toContain("pikachu.png");
});

test("after clicking a button, all buttons are disabled", async () => {
  await loadPokemon();
  const buttons = Array.from(document.querySelectorAll("#options button"));
  buttons[0].click();
  expect(buttons.every((b) => b.disabled)).toBe(true);

  const msg = document.getElementById("result-msg");
  expect(msg.textContent).toMatch(/correct|oops/i);
});

test("after correct type, game asks for name", async () => {
  await loadPokemon();
  const buttons = Array.from(document.querySelectorAll("#options button"));
  const correctBtn = buttons.find(
    (b) => b.textContent.toLowerCase() === "electric"
  );
  correctBtn.click();

  await new Promise((r) => setTimeout(r, 1600));
  const heading = document.querySelector("h2");
  expect(heading.textContent.toLowerCase()).toMatch(
    /what's the name of this pokémon/i
  );

  const nameButtons = document.querySelectorAll("#options button");
  expect(nameButtons).toHaveLength(4);
});
