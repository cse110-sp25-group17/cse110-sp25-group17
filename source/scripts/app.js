export let currentIndex = 0;
export let activeDeck = [];
showCard(0); // show the first card on load

export async function loadAllPokemon() {
  const limit = 151;
  for (let id = 1; id <= limit; id++) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();

    activeDeck.push({
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      img: data.sprites.front_default,
      types: data.types.map(t => t.type.name)
    });
  }

  showCard(0); //show the first card
}

export function showCard(index) {
  const container = document.getElementById('card-container');
  if (!container) return;  

  container.innerHTML = "";

  const pokemon = activeDeck.at(index);
  if (index >= 0 && index < activeDeck.length) {
    const name = pokemon.name;
    const img = pokemon.img;

    const card = document.createElement("div");
    card.className = "card";

    const image = document.createElement("img");
    image.src = img;
    image.alt = name;

    const heading = document.createElement("h2");
    heading.textContent = name;

    card.appendChild(image);
    card.appendChild(heading);
    container.appendChild(card);
  } 
  else {
    container.innerHTML = "<h2>No Pokémon Here</h2>";
  }
}



export function nextCard() {
  // const container = document.getElementById("card-container");
  if (currentIndex < activeDeck.length - 1) {
    currentIndex++;
    showCard(currentIndex);
  }
}

export function prevCard() {
  // const container = document.getElementById("card-container");
  if (currentIndex > 0) {
    currentIndex--;
    showCard(currentIndex);
  }
}

export function addPokemon() {
//  const container = document.getElementById("card-container");
  const name = prompt("Enter Pokémon name:");
  const img = prompt("Enter image URL:");
  if (name && img) {
    activeDeck.push({
      id: activeDeck.length + 1,
      name,
      img,
      types: []
    });
    currentIndex = activeDeck.length - 1;
    showCard(currentIndex);
  }
}

// removes the current pokemon from the activeDeck
export function removePokemon() {
//  const container = document.getElementById("card-container");
  if (activeDeck.length === 0) {
    return;
  }
  activeDeck.splice(currentIndex, 1);
  
  if(activeDeck.length === 0){
    container.innerHTML = "<h2>No Pokémon Here</h2>";
    return;
  }if(currentIndex >= activeDeck.length){
    currentIndex = activeDeck.length - 1;
  }
    showCard(currentIndex);
  

}
// setter function so test file can access non-exported currentIndex
export function setCurrentIndex(index) {
  currentIndex = index;
}
// Attach button event listeners
document.getElementById("delete-btn")?.addEventListener("click",removePokemon);
document.getElementById("next-btn")?.addEventListener("click", nextCard);
document.getElementById("prev-btn")?.addEventListener("click", prevCard);
document.getElementById("add-btn")?.addEventListener("click", addPokemon);

window?.addEventListener("DOMContentLoaded", () => {
  loadAllPokemon();
});

document.addEventListener("DOMContentLoaded", () => {
  const deckBtn = document.getElementById("deck-view-btn");
  const gameBtn = document.getElementById("game-view-btn");
  const addEditBtn = document.getElementById("add-edit-btn");
  const modal = document.getElementById("popup-modal");
  const editBtn = document.getElementById("edit-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const closeBtn = document.getElementById("close-modal-btn");

  if (deckBtn) deckBtn.addEventListener("click", () => {
    window.location.href = "collection_2.html";
  });

  if (gameBtn) gameBtn.addEventListener("click", () => {
    window.location.href = "game_page.html";
  });

  if (addEditBtn) addEditBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  if (closeBtn) closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  if (editBtn) editBtn.addEventListener("click", () => {
    window.location.href = "edit_page.html";
  });

  if (deleteBtn) deleteBtn.addEventListener("click", () => {
    alert("I havent done this yet");
    modal.style.display = "none";
  });
});