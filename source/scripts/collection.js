// collection.js
/*
- Seeds the collection with Bulbasaur, Charmander, and Squirtle the first time it runs
- Loads and saves the collection to localStorage so catches persist across page reloads
- Provides a Collection class (with methods to check for duplicates and add new Pokémon) and export an instance we can import elsewhere
- Exports a renderCollection() function that wipes and redraws the <div id="collection-container"> based on whatever’s currently in your stored collection
*/

const starterPokemons = [
  {
    id:       1,
    name:     "Bulbasaur",
    img:      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    nickname: "",
    userAdded: false
  },
  {
    id:       4,
    name:     "Charmander",
    img:      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    nickname: "",
    userAdded: false
  },
  {
    id:       7,
    name:     "Squirtle",
    img:      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    nickname: "",
    userAdded: false
  }
];

export class Collection {
  constructor() {
    const raw = localStorage.getItem("pokemonCollection");
    // If nothing in storage, use starterPokemons
    this._list = raw ? JSON.parse(raw) : [...starterPokemons];
    this._save(); // make sure the seed is persisted
  }

  get all() {
    return this._list;
  }

  get count() {
    return this._list.length;
  }

  has(id) {
    return this._list.some((p) => p.id === id);
  }

  add(pokemon) {
    if (this.has(pokemon.id)) return false;

    const formattedPokemon = {
      id: pokemon.id,
      name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
      img: pokemon.img,
      nickname: pokemon.nickname || "",
      userAdded: pokemon.userAdded|| false
    };

    this._list.push(formattedPokemon);
    this._save();
    return true;
  }

  _save() {
    localStorage.setItem("pokemonCollection", JSON.stringify(this._list));
  }

  clear() {
    this._list = [...starterPokemons];
    this._save();
  }
}

export const collection = new Collection();

// Render helper
export function renderCollection() {
  const container = document.getElementById("collection-container");
  if (!container) return;

  container.innerHTML = "";

  collection.all.forEach(p => {
    const card = document.createElement("div");
    card.className = "pokemon-card";

    // If the user added this pokemon, append a small badge
    if (p.userAdded) {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = "★"; // you could use text or an icon here
      card.append(badge);
    }

    const image = document.createElement("img");
    image.src = p.img;
    image.alt = p.name;
    card.append(image);

    const heading = document.createElement("h3");
    heading.textContent = p.nickname || p.name;
    card.append(heading);

    container.append(card);
  });
}
async function addPokemonToCollection() {
  const name = prompt("Enter Pokémon name:");
  if (!name) return;

  // 1) Attempt to fetch from PokéAPI
  let img = "";
  let pokeId = null;
  let pokeName = "";
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (res.ok) {
      const data = await res.json();
      img = data.sprites.front_default || "";
      pokeId = data.id;
      pokeName = data.name;
    }
  } catch (_) {
    // silently fall back to manual URL prompt
  }
 if(pokeId < 1 || pokeId > 151){
  alert("Pokemon not found.")
  return;
 }
  // 2) If no image yet, ask for one
  if (!img) {
    img = prompt("PokéAPI lookup failed or no sprite found. Enter a valid image URL:") || "";
  }

  // 3) Insert into collection with userAdded = true
  const wasAdded = collection.add({
    id:        pokeId,  // unique timestamp ID
    name:      pokeName,
    img:       img,
    nickname:  "",
    userAdded: true
  });

  if (wasAdded) {
    renderCollection();
  } else {
    alert("That Pokémon is already in your collection.");
  }
}
// Immediately render on script‐load (if DOM is already there)
window.addEventListener("DOMContentLoaded", () => {
  renderCollection();
  document.getElementById("add_to_collection_btn").addEventListener("click", addPokemonToCollection);

});// Initial render

