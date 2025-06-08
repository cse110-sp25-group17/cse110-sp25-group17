
export let currentIndex = 0;
export let activeDeck = [];

export async function loadAllPokemon() {
  const spinner = document.getElementById("loading"); // loading text
  if (spinner) spinner.style.display = "block";

  const navButtons = document.getElementById("buttons");
  if (navButtons) navButtons.style.display = "none"; // Navigation buttons are disabled when loading

  const initialLoadCount = 10;
  const totalCount = 151;

  // loading first 10 cards
  for (let id = 1; id <= initialLoadCount; id++) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();

    activeDeck.push({
      id: data.id,
      name: capitalize(data.name),
      img: data.sprites.front_default,
      types: data.types.map((t) => t.type.name)
    });
  }

  if (spinner) spinner.style.display = "none";
  if (navButtons) navButtons.style.display = "block";

  showCard(0);

  // loading rest in the background
  for (let id = initialLoadCount + 1; id <= totalCount; id++) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(res => res.json())
      .then(data => {
        activeDeck.push({
          id: data.id,
          name: capitalize(data.name),
          img: data.sprites.front_default,
          types: data.types.map((t) => t.type.name)
        });
        updateNavButtons();
      });
  }
}

// Utility function
function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function showCard(index) {
  const container = document.getElementById("card-container");
  if (!container) return;

  container.innerHTML = "";

  const pokemon = activeDeck.at(index);
  if (index >= 0 && index < activeDeck.length) {
    const name = pokemon.name;
    const img = pokemon.img;

    const card = document.createElement("div");
    card.className = "pokemon-card";

    const image = document.createElement("img");
    image.src = img;
    image.alt = name;
   
    const heading = document.createElement("h2");
    heading.textContent = name;

    card.appendChild(image);
    card.appendChild(heading);
    container.appendChild(card);
  } 
  updateNavButtons();
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
  const container = document.getElementById("card-container");
  if (activeDeck.length === 0) {
    return;
  }
  activeDeck.splice(currentIndex, 1);

  if (activeDeck.length === 0) {
    container.innerHTML = "<h2>No Pokémon Here</h2>";
    return;
  }
  if (currentIndex >= activeDeck.length) {
    currentIndex = activeDeck.length - 1;
  }
  showCard(currentIndex);
}
// setter function so test file can access non-exported currentIndex
export function setCurrentIndex(index) {
  currentIndex = index;
}

function updateNavButtons() { // Navigation button on home will be blocked if First or last card
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  if (!prevBtn || !nextBtn) return;

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex >= activeDeck.length - 1;
}

// Attach button event listeners
document.getElementById("delete-btn")?.addEventListener("click", removePokemon);
document.getElementById("next-btn")?.addEventListener("click", nextCard);
document.getElementById("prev-btn")?.addEventListener("click", prevCard);
window?.addEventListener("DOMContentLoaded", () => {
  loadAllPokemon();
});

