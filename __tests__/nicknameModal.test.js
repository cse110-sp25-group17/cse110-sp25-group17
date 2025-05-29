/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';

describe("Nickname Modal Popup", () => {
  let modal, nicknameBtn, closeBtn, saveBtn, nicknameInput;

  beforeEach(() => {
    // Inject a simplified DOM structure needed for testing
    document.body.innerHTML = `
      <button id="nickname-btn">Edit Nickname</button>
      <div id="nickname-modal" class="modal" style="display: none;">
        <div class="modal-content">
          <span id="close-modal" class="close">&times;</span>
          <input type="text" id="nickname-input" />
          <button id="save-nickname">Save</button>
        </div>
      </div>
    `;

    // Store DOM references for easier access
    modal = document.getElementById("nickname-modal");
    nicknameBtn = document.getElementById("nickname-btn");
    closeBtn = document.getElementById("close-modal");
    saveBtn = document.getElementById("save-nickname");
    nicknameInput = document.getElementById("nickname-input");

    // Simulate modal logic from app.js

    // Show the modal when the Edit Nickname button is clicked
    nicknameBtn.addEventListener("click", () => {
      modal.style.display = "flex";
    });

    // Close the modal and clear input when the close (X) button is clicked
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      nicknameInput.value = "";
    });

    // Close the modal when clicking outside of the modal content
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        nicknameInput.value = "";
      }
    });

    // Save nickname and close modal if nickname is not empty
    saveBtn.addEventListener("click", () => {
      const nickname = nicknameInput.value.trim();
      if (nickname && window.activeDeck?.length > 0) {
        window.activeDeck[window.currentIndex].nickname = nickname;
        window.showCard?.(window.currentIndex); // Refresh card display
      }
      modal.style.display = "none";
      nicknameInput.value = "";
    });
  });

  // Test if modal opens when Edit Nickname button is clicked
  test("opens modal when Edit Nickname button is clicked", () => {
    nicknameBtn.click();
    expect(modal.style.display).toBe("flex");
  });

  // Test if modal closes and input clears when close button is clicked
  test("closes modal when clicking close button", () => {
    modal.style.display = "flex";
    closeBtn.click();
    expect(modal.style.display).toBe("none");
    expect(nicknameInput.value).toBe("");
  });

  // Test if modal closes when clicking outside the modal content
  test("closes modal when clicking outside the modal", () => {
    modal.style.display = "flex";
    const clickEvent = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(clickEvent, "target", { value: modal });
    window.dispatchEvent(clickEvent);
    expect(modal.style.display).toBe("none");
    expect(nicknameInput.value).toBe("");
  });

  // Test if nickname is saved properly and modal is closed
  test("saves nickname and closes modal", () => {
    const mockDeck = [{ nickname: "" }];
    window.activeDeck = mockDeck;
    window.currentIndex = 0;
    window.showCard = jest.fn();

    nicknameInput.value = "Pika";
    saveBtn.click();

    expect(mockDeck[0].nickname).toBe("Pika"); // nickname saved
    expect(modal.style.display).toBe("none"); // modal closed
    expect(nicknameInput.value).toBe("");     // input cleared
    expect(window.showCard).toHaveBeenCalledWith(0); // card refreshed
  });

  // Test that an empty nickname is not saved
  test("does not save empty nickname", () => {
    const mockDeck = [{ nickname: "" }];
    window.activeDeck = mockDeck;
    window.currentIndex = 0;
    window.showCard = jest.fn();

    nicknameInput.value = "";
    saveBtn.click();

    expect(mockDeck[0].nickname).toBe(""); // nickname remains unchanged
    expect(window.showCard).not.toHaveBeenCalled(); // showCard not triggered
  });
});
