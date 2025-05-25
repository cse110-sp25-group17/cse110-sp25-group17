/**
 * @jest-environment jsdom
 */
import { jest } from "@jest/globals";

describe("setNickname()", () => {
  let app;

  beforeAll(async () => {
    document.body.innerHTML = `
      <div id="card-container"></div>
      <button id="edit-btn"></button>
    `;

    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        id: 1,
        name: "StubMon",
        sprites: { front_default: "stub.png" },
        types: []
      })
    });

    app = await import("../source/scripts/app.js");
  });

  beforeEach(() => {
    app.activeDeck.splice(0);
    app.activeDeck.push(
      { id: 1, name: "A", nickname: "", img: "", types: [] },
      { id: 2, name: "B", nickname: "", img: "", types: [] },
      { id: 3, name: "C", nickname: "", img: "", types: [] }
    );
    app.setCurrentIndex(0);
  });

  test("success: sets nickname when prompt returns a string", () => {
    // whenever prompt is called, set the return value to Sparky
    jest.spyOn(global, "prompt").mockReturnValue("Sparky");
    app.setNickname();
    expect(app.activeDeck[0].nickname).toBe("Sparky");

    app.showCard(0);
    const containerText = document.getElementById("card-container").textContent;
    
    expect(containerText).toContain("Nickname: Sparky");
    global.prompt.mockRestore();
  });
test("can set distinct nicknames on each card", () => {
    const nicknames = ["Alpha","Bravo","Charlie"];
    for (let i = 0; i < nicknames.length; i++) {
      jest.spyOn(global, "prompt").mockReturnValue(nicknames[i]);
      app.setCurrentIndex(i);
      app.setNickname();
      expect(app.activeDeck[i].nickname).toBe(nicknames[i]);
      global.prompt.mockRestore();
    }
  });

  test("can overwrite an existing nickname", () => {
    
    // set initial nickname for the second card to be First
    jest.spyOn(global, "prompt").mockReturnValue("First");
    app.setCurrentIndex(1); 
    app.setNickname();
    expect(app.activeDeck[1].nickname).toBe("First");
    global.prompt.mockRestore();

    // now overwrite nickname with the nickname: Second
    jest.spyOn(global, "prompt").mockReturnValue("Second");
    app.setNickname();
    expect(app.activeDeck[1].nickname).toBe("Second");
    global.prompt.mockRestore();
  });


  test("failure: leaves nickname blank when prompt is cancelled", () => {
    jest.spyOn(global, "prompt").mockReturnValue(null);
    app.setNickname();
    app.showCard(0);
    
    const containerText = document.getElementById("card-container").textContent;
    expect(containerText).not.toContain("Nickname:)");
    
    global.prompt.mockRestore();
  });
});
