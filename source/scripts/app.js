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
  else {
    container.innerHTML = "<h2>No Pokémon Here</h2>";
  }
}


function nextCard() {
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


// check if Pokémon name is legit
async function isValidPokemon(name) {

  // creates a recquest to the API to check if the name is valid
  const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
  const res = await fetch(url).catch(() => null);

  // if the name is valid, the API will return a 200 status code
  // if the name is invalid, it will return a 404 status code
  return res?.ok || false;
}

// helper to capitalize name when adding
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// updated addPokemon function with validation
export async function addPokemon() {
  const nameInput = prompt("Enter Pokémon name:");
  if (!nameInput) return;

  const name = nameInput.toLowerCase();
  const isValid = await isValidPokemon(name);
  if (!isValid) {
    alert("Invalid Pokémon name. Please try again.");
    return;
  }
  // when adding a pokemon, it lets you choose a custom image
  // or a default one from the API
  let img = prompt("Enter image URL (leave blank to use default):");
  if (!img) {
    const pokeData = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => res.json());
    img = pokeData.sprites.front_default || "";
  }

  // pushes the pokemon onto the array
  activeDeck.push({
    id: activeDeck.length + 1,
    name: capitalize(name),
    img,
    types: []
  });
  currentIndex = activeDeck.length - 1;
  showCard(currentIndex);
}

// removes the current pokemon from the activeDeck
export function removePokemon() {
  const container = document.getElementById("card-container");
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
