const pokemons = [
  { name: "Bulbasaur", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
  { name: "Charmander", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
  { name: "Squirtle", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" }
];

let currentIndex = 0;
const container = document.getElementById("card-container");

function showCard(index) {
  container.innerHTML = "";

  if (index >= 0 &&
    index < pokemons.length &&
    typeof pokemons[index] === "object" &&
    pokemons[index] !== null &&
    typeof pokemons[index].name === "string" &&
    typeof pokemons[index].img === "string"
  ) {
    const { name, img } = pokemons[index]; // correct and used

    // Create card elements
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

function addPokemon() {
  const name = prompt("Enter Pokémon name:");
  const img = prompt("Enter image URL:");
  if (name && img) {
    pokemons.push({ name, img });
    currentIndex = pokemons.length - 1;
    showCard(currentIndex);
  }
}



// Attach button event listeners
document.getElementById("next-btn").addEventListener("click", nextCard);
document.getElementById("prev-btn").addEventListener("click", prevCard);
document.getElementById("add-btn").addEventListener("click", addPokemon);

// Initial render
showCard(currentIndex);
