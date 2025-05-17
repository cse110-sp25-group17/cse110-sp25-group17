const pokemons = [
  { name: "Bulbasaur", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
  { name: "Charmander", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
  { name: "Squirtle", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" }
];

let currentIndex = 0;
const container = document.getElementById("card-container");

function showCard(index) {
  container.innerHTML = "";

  if (index < pokemons.length && index >= 0) {
    const { name, img } = pokemons[index];
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<img src="${img}" alt="${name}" /><h2>${name}</h2>`;
    container.appendChild(card);
    setupSwipe(card);
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

function setupSwipe(card) {
  let startX;

  card.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  card.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    handleSwipe(endX - startX);
  });

  card.addEventListener("mousedown", (e) => {
    startX = e.clientX;
  });

  card.addEventListener("mouseup", (e) => {
    const endX = e.clientX;
    handleSwipe(endX - startX);
  });
}

function handleSwipe(deltaX) {
  if (deltaX < -50) {
    nextCard();
  } else if (deltaX > 50) {
    prevCard();
  }
}

// Attach button event listeners
document.getElementById("next-btn").addEventListener("click", nextCard);
document.getElementById("prev-btn").addEventListener("click", prevCard);
document.getElementById("add-btn").addEventListener("click", addPokemon);

// Initial render
showCard(currentIndex);
