const pokemons = [
  { name: "Bulbasaur", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
  { name: "Charmander", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
  { name: "Squirtle", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" }
];

let currentIndex = 0;
const container = document.getElementById("card-container");

function showCard(index) {
  container.innerHTML = "";

  const pokemon = pokemons.at(index);
  if (index >= 0 && index < pokemons.length) {
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

  } else {
    container.innerHTML = "<h2>No Pokémon Here</h2>";
  }
}

function nextCard() {
  if (currentIndex < pokemons.length - 1) {
    currentIndex++;
    showCard(currentIndex);
  }
}

function prevCard() {
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
async function addPokemon() {
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
  pokemons.push({ name: capitalize(name), img });
  currentIndex = pokemons.length - 1;
  showCard(currentIndex);
}


// Button event listeners
document.getElementById("next-btn").addEventListener("click", nextCard);
document.getElementById("prev-btn").addEventListener("click", prevCard);
document.getElementById("add-btn").addEventListener("click", addPokemon);

// Initial render
showCard(currentIndex);
