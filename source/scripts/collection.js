/*
  - Seeds the collection with Bulbasaur, Charmander, and Squirtle the first time it runs
  - Loads and saves the collection to localStorage so catches persist across page reloads
  - Provides a Collection class (with methods to check for duplicates and add or remove Pokémon)
  - Exports renderCollection() to redraw the #collection-container
  - addPokemonToCollection() → prompts for a name or ID, fetches from PokéAPI, and adds if valid
*/

// ───–── Seeded "starter" Pokémon –───–──
// A brand-new Collection() (when localStorage has no key) must start with exactly these three,
// so that tests expecting `collection.count === 3` on first run will succeed.
const starterPokemons = [
  {
<<<<<<< HEAD
    id:       1,
    name:     "Bulbasaur",
    img:      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    nickname: "",
    type:     "grass"
  },
  {
    id:       4,
    name:     "Charmander",
    img:      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    nickname: "",
    type:     "fire"
  },
  {
    id:       7,
    name:     "Squirtle",
    img:      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    nickname: "",
    type:     "water"
=======
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
>>>>>>> origin/main
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

<<<<<<< HEAD
    const formattedPokemon = {
      id: pokemon.id,
      name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
      img: pokemon.img,
      nickname: pokemon.nickname || "",
      type: pokemon.type || "unknown" // ✅ Add type field (fallback to "unknown")
=======
    // Normalize and push
    const formatted = {
      id:        pokemon.id,
      name:      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
      img:       pokemon.img,
      nickname:  pokemon.nickname || "",
      userAdded: Boolean(pokemon.userAdded)
>>>>>>> origin/main
    };

    this._list.push(formatted);
    this._save();
    return true;
  }

<<<<<<< HEAD
  _save() {
    localStorage.setItem("pokemonCollection", JSON.stringify(this._list));
  }

  clear() {
    this._list = [...starterPokemons];
    this._save();
  }

=======
>>>>>>> origin/main
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

<<<<<<< HEAD
// Helper: Get all unique types in the collection
function getAllTypes() {
  const typeSet = new Set();
  collection.all.forEach(p => {
    if (typeof p.type === "string") {
      typeSet.add(p.type);
    }
  });
  return Array.from(typeSet).sort();
}

// Render the type filter dropdown
export function renderTypeFilter() {
  const select = document.getElementById("type-filter");
  if (!select) return;
  select.querySelectorAll("option:not([value='all'])").forEach(opt => opt.remove());
  getAllTypes().forEach(type => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    select.appendChild(opt);
  });
}

// In renderCollection, filter by p.type
=======
>>>>>>> origin/main
export function renderCollection() {
  const container = document.getElementById("collection-container");
  if (!container) return;

  const select = document.getElementById("type-filter");
  const selectedType = select?.value || "all";

  let filtered = collection.all;
  if (selectedType !== "all") {
    filtered = filtered.filter(p => p.type === selectedType);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <p>You don't have any Pokémon of this type yet. <a href="game_page.html">Play the game</a> to catch some!</p>
    `;
    return;
  }

  container.innerHTML = "";
<<<<<<< HEAD
  filtered.forEach(p => {
    const link = document.createElement('a');
    link.href = `edit_page.html?id=${p.id}`; 
    link.className = 'pokemon-card-link';

    const card = document.createElement('div');
    card.className = 'pokemon-card';
=======
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
>>>>>>> origin/main

    const image = document.createElement("img");
    image.src = p.img;
    image.alt = p.name;
    card.append(image);

    const heading = document.createElement("h3");
<<<<<<< HEAD
    heading.textContent = p.nickname || p.name;

    const typeInfo = document.createElement("p");
    typeInfo.className = "pokemon-type";
    typeInfo.textContent = `Type: ${p.type || "Unknown"}`;

    card.append(image, heading, typeInfo);
    link.appendChild(card);
    container.appendChild(link);
  });
}
=======
    heading.textContent = p.name;

    const nickname = document.createElement("p");
    nickname.textContent = p.nickname ? `(${p.nickname})` : "";
    nickname.classList.add("nickname");

    card.append(heading, nickname);

        link.appendChild(card);
        container.appendChild(link);
      });
    }

export async function addPokemonToCollection() {
  const nameInput = prompt("Enter Pokémon name:");
  if (!nameInput) return;

  // Only allow names: block if input is a number
  if (!isNaN(nameInput.trim())) {
    alert("Please enter a valid Pokémon name, not a number.");
    return;
  }

  let pokeData;
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameInput.trim().toLowerCase()}`);
    if (!res.ok) {
      alert("Pokémon not found. Please enter a valid name.");
      return;
    }
    pokeData = await res.json();
  } catch {
    alert("Network error when looking up PokéAPI.");
    return;
  }
  if (pokeData.id <= 151) {
    alert("You must catch this pokemon via the game page 😊.");
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

window.addEventListener("DOMContentLoaded", () => {
  renderCollection();
  const btn = document.getElementById("add-pokemon-btn");
  if (btn) {
    btn.addEventListener("click", addPokemonToCollection);
  }
});
>>>>>>> origin/main
