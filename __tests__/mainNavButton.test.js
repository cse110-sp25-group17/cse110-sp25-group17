/**
 * @jest-environment jsdom
 */

import { showCard, setCurrentIndex, activeDeck } from "../source/scripts/app.js";

beforeEach(() => {
  document.body.innerHTML = `
    <div id="buttons">
      <button id="prev-btn">⬅️ Previous</button>
      <button id="next-btn">➡️ Next</button>
    </div>
    <div id="card-container"></div>
  `;

  // Reset activeDeck and add 3 dummy Pokémon
  activeDeck.length = 0;
  activeDeck.push(
    { name: "Bulbasaur", img: "img1", types: [] },
    { name: "Ivysaur", img: "img2", types: [] },
    { name: "Venusaur", img: "img3", types: [] }
  );
});

test("Previous button is disabled on the first card", () => {
  setCurrentIndex(0);
  showCard(0);

  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  expect(prevBtn.disabled).toBe(true);
  expect(nextBtn.disabled).toBe(false);
});

test("Next button is disabled on the last card", () => {
  setCurrentIndex(2);
  showCard(2);

  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  expect(prevBtn.disabled).toBe(false);
  expect(nextBtn.disabled).toBe(true);
});

test("Both buttons are enabled on a middle card", () => {
  setCurrentIndex(1);
  showCard(1);

  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  expect(prevBtn.disabled).toBe(false);
  expect(nextBtn.disabled).toBe(false);
});
