/*
  - Seeds the collection with Bulbasaur, Charmander, and Squirtle the first time it runs
  - Loads and saves the collection to localStorage so catches persist across page reloads
  - Provides a Collection class (with methods to check for duplicates and add new Pokémon)
  - Exports renderCollection() to redraw the #collection-container
  - addPokemonToCollection() → prompts for a name, fetches from PokéAPI, and adds if valid Gen I
*/

const starterPokemons = [
  {
    id: 1,
    name: "Bulbasaur",
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    nickname: "",
    userAdded: false
  },
  {
    id: 4,
    name: "Charmander",
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    nickname: "",
    userAdded: false
  },
  {
    id: 7,
    name: "Squirtle",
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    nickname: "",
    userAdded: false
  }
];

export class Collection {
  constructor() {
    const raw = localStorage.getItem("pokemonCollection");
    this._list = raw ? JSON.parse(raw) : [...starterPokemons];
    this._save();
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
      id:        pokemon.id,
      name:      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
      img:       pokemon.img,
      nickname:  pokemon.nickname || "",
      userAdded: Boolean(pokemon.userAdded)
    };

    this._list.push(formattedPokemon);
    this._save();
    return true;
  }

  clear() {
    this._list = [...starterPokemons];
    this._save();
  }

  _save() {
    localStorage.setItem("pokemonCollection", JSON.stringify(this._list));
  }
}

export const collection = new Collection();

export function renderCollection() {
  const container = document.getElementById("collection-container");
  if (!container) return;

  container.innerHTML = "";

  collection.all.forEach((p) => {
    const card = document.createElement("div");
    card.className = "pokemon-card";

    // Add a star badge if added by the User
    if (p.userAdded) {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = "★";
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
  const name = prompt("Enter Pokémon name (Gen I only):");
  if (!name) return;

  let pokeData;
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.trim().toLowerCase()}`
    );
    if (!res.ok) {
      alert("Pokémon not found. Please use a Gen I name.");
      return;
    }
    pokeData = await res.json();
  } catch {
    alert("Network error when looking up PokéAPI.");
    return;
  }

  const pokeId = pokeData.id;
  if (pokeId < 1 || pokeId > 151) {
    alert("Please enter a Gen I Pokémon (ID 1–151).");
    return;
  }

  const newPokemon = {
    id: pokeData.id,
    name: pokeData.name,
    img: pokeData.sprites.front_default || "",
    nickname: "",
    userAdded: true
  };

  const wasAdded = collection.add(newPokemon);
  if (!wasAdded) {
    alert("That Pokémon is already in your collection.");
    return;
  }

  renderCollection();
}

window.addEventListener("DOMContentLoaded", () => {
  renderCollection();
  const btn = document.getElementById("add_to_collection_btn");
  if (btn) {
    btn.addEventListener("click", addPokemonToCollection);
  }
});
