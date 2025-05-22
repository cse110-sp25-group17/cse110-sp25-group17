/**
 * @jest-environment jsdom
 */
import { jest } from "@jest/globals";

describe("removePokemon()", () => {
    // to hold app module
  let app; 

  beforeAll(async () => {
    
    document.body.innerHTML = `
      <div id="card-container"></div>
      <button id="prev-btn"></button>
      <button id="next-btn"></button>
      <button id="add-btn"></button>
      <button id="delete-btn"></button>
    `;

   
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        id: 1,
        name: "Stub",
        sprites: { front_default: "stub" },
        types: []
      })
    });
    app = await import("../source/scripts/app.js");
  });

  beforeEach(() => {
    
    // clear whatever loadAllPokemon added
    app.activeDeck.splice(0);          
    app.activeDeck.push(
      { id: 1, name: "A", img: "blankimage1", types: [] },
      { id: 2, name: "B", img: "blankimage2", types: [] }
    );
    app.setCurrentIndex(1);              
  });

  test("removes the current card and shows the previous one", () => {
    
    // before calling removePokemon(), activeDck should contain 2 cards: A and B
    app.removePokemon();

    // currently active deck should contain only card A
    expect(app.activeDeck).toHaveLength(1);
    expect(app.activeDeck[0].name).toBe("A");
    expect(app.currentIndex).toBe(0);

// check 
    const heading = document.querySelector("#card-container h2");
    expect(heading.textContent).toBe("A");
    expect(heading.textContent).not.toBe("B");

  });
});
