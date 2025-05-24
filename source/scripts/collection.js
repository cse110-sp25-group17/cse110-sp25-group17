// collection.js

const pokemons = [ // Array of Pokemon objects (temporary data for testing)
  { name: "Bulbasaur", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
  { name: "Charmander", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
  { name: "Squirtle", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" }
];

const container = document.getElementById("collection-container");

pokemons.forEach(pokemon => { // Loop through each pokemon in the array
  console.log(pokemon.name);
  const card = document.createElement("div");
  card.className = "pokemon-card"; // Create a card for each pokemon

  const image = document.createElement("img");
  image.src = pokemon.img;
  image.alt = pokemon.name;

  const heading = document.createElement("h3");
  heading.textContent = pokemon.name;

  card.appendChild(image);
  card.appendChild(heading);
  container.appendChild(card);
});