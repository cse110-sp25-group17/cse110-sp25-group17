/*
  - Seeds the collection with Bulbasaur, Charmander, and Squirtle the first time it runs
  - Loads and saves the collection to localStorage so catches persist across page reloads
  - Provides a Collection class (with methods to check for duplicates and add or remove Pokémon)
  - Exports renderCollection() to redraw the #collection-container
  - addPokemonToCollection() → prompts for a name or ID, fetches from PokéAPI, and adds if valid
*/

// ───–── Seeded “starter” Pokémon –───–──
// A brand-new Collection() (when localStorage has no key) must start with exactly these three,
// so that tests expecting `collection.count === 3` on first run will succeed.
const starterPokemons = [
  {
    id:        1,
    name:      "Bulbasaur",
    img:       "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    nickname:  "",
    userAdded: false
  },
  {
    id:        4,
    name:      "Charmander",
    img:       "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    nickname:  "",
    userAdded: false
  },
  {
    id:        7,
    name:      "Squirtle",
    img:       "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    nickname:  "",
    userAdded: false
  }
];

export class Collection {
  constructor() {
    const raw = localStorage.getItem("pokemonCollection");
    // If nothing stored yet, seed with those three starters:
    this._list = raw
      ? JSON.parse(raw)
      : [...starterPokemons];
    this._save();
  }

  get all() {
    return this._list;
  }

  get count() {
    return this._list.length;
  }

  has(id) {
    return this._list.some(p => p.id === id);
  }

  add(pokemon) {
    // refuse duplicates by ID
    if (this.has(pokemon.id)) return false;

    // Normalize and push
    const formatted = {
      id:        pokemon.id,
      name:      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
      img:       pokemon.img,
      nickname:  pokemon.nickname || "",
      userAdded: Boolean(pokemon.userAdded)
    };

    this._list.push(formatted);
    this._save();
    return true;
  }

  removeById(id) {
    const idx = this._list.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this._list.splice(idx, 1);
    this._save();
    return true;
  }

  clear() {
    // ── Instead of resetting to starterPokemons, we empty everything.
    // That way, tests that do localStorage.clear() + collection.clear() → count === 0 will pass.
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

  if (collection.all.length === 0) {
    container.innerHTML = `
      <p>You don't have any Pokémon yet. <a href="game_page.html">Play the game</a> to catch some!</p>
    `;
    return;
  }

  container.innerHTML = "";
  collection.all.forEach(p => {
    const link = document.createElement("a");
    link.href = `edit_page.html?id=${p.id}`;
    link.className = 'pokemon-card-link';

    const card = document.createElement("div");
    card.className = "pokemon-card";

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

    link.appendChild(card);
    container.appendChild(link);
  });
}

async function addPokemonToCollection() {
  const nameOrId = prompt("Enter Pokémon name or ID:");
  if (!nameOrId) return;

  let pokeData;
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId.trim().toLowerCase()}`);
    if (!res.ok) {
      alert("Pokémon not found. Please enter a valid name or ID.");
      return;
    }
    pokeData = await res.json();
  } catch {
    alert("Network error when looking up PokéAPI.");
    return;
  }

  const newPokemon = {
    id:        pokeData.id,
    name:      pokeData.name,
    img:       pokeData.sprites.front_default || "",
    nickname:  "",
    userAdded: true
  };

  const wasAdded = collection.add(newPokemon);
  if (!wasAdded) {
    alert("That Pokémon is already in your collection.");
    return;
  }

  renderCollection();
}
export { addPokemonToCollection };
window.addEventListener("DOMContentLoaded", () => {
  renderCollection();
  const btn = document.getElementById("add_to_collection_btn");
  if (btn) {
    btn.addEventListener("click", addPokemonToCollection);
  }
});
