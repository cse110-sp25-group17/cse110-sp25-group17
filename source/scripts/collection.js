/*
  - Seeds the collection with Bulbasaur, Charmander, and Squirtle the first time it runs
  - Loads and saves the collection to localStorage so catches persist across page reloads
  - Provides a Collection class (with methods to check for duplicates and add or remove Pokémon)
  - Exports renderCollection() to redraw the #collection-container
  - addPokemonToCollection() → prompts for a name or ID, fetches from PokéAPI, and adds if valid
*/

// ───–── Seeded "starter" Pokémon –──–──
// A brand-new Collection() (when localStorage has no key) must start with exactly these three,
// so that tests expecting `collection.count === 3` on first run will succeed.
const starterPokemons = [
  {
    id: 1,
    name: "Bulbasaur",
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    nickname: "",
    type: "Grass",
    userAdded: false
  },
  {
    id: 4,
    name: "Charmander",
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    nickname: "",
    type: "Fire",
    userAdded: false
  },
  {
    id: 7,
    name: "Squirtle",
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    nickname: "",
    type: "Water",
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

    const formatted = {
      id: pokemon.id,
      name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
      img: pokemon.img,
      nickname: pokemon.nickname || "",
      type: pokemon.type || "unknown",
      userAdded: Boolean(pokemon.userAdded),
      favorite: false
    };

    this._list.push(formatted);
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

  removeById(id) {
    const idx = this._list.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this._list.splice(idx, 1);
    this._save();
    return true;
  }
}

export const collection = new Collection();

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

//------------------------for favorite icon--------------------------
export function getFavorites() {
  return JSON.parse(localStorage.getItem('favoriteList') || '[]');
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}

export function toggleFavorite(id) {
  const favs = getFavorites();
  const index = favs.indexOf(id);
  if (index === -1) {
  favs.push(id);
  } else {
  favs.splice(index, 1);
  }
  localStorage.setItem('favoriteList', JSON.stringify(favs));
}
//------------------------for favorite icon--------------------------


function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// In renderCollection, filter by p.type
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
  filtered.forEach(p => {
    const link = document.createElement('a');
    link.href = `edit_page.html?id=${p.id}`; 
    link.className = 'pokemon-card-link';

    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.style.position = 'relative'; //for favorite icon

    // User-added badge
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

    // Nickname (if present and not already shown)
    if (p.nickname) {
      const nickname = document.createElement("p");
      nickname.textContent = `(${p.nickname})`;
      nickname.classList.add("nickname");
      card.append(nickname);
    }

    // Type info
    const typeInfo = document.createElement("p");
    typeInfo.className = "pokemon-type";
    typeInfo.textContent = `Type: ${capitalize(p.type || "Unknown")}`;
    card.append(typeInfo);

    // favorite icon
    const favIcon = document.createElement('span');
    favIcon.className = 'favorite-icon';

    const img = document.createElement('img');
    img.className = 'heart-img';
    img.alt = isFavorite(p.id) ? 'favorite' : 'not favorite';
    img.src = isFavorite(p.id)
      ? '../assets/images/icons/heart-red.png'
      : '../assets/images/icons/heart-white.png';
    favIcon.appendChild(img);

    favIcon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(p.id);
      renderCollection();
    });
    
    card.appendChild(favIcon);
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
    id: pokeData.id,
    name: pokeData.name,
    img: pokeData.sprites.front_default || "",
    nickname: "",
    type: Array.isArray(pokeData.types) && pokeData.types.length > 0
      ? pokeData.types[0].type.name
      : "unknown",
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
