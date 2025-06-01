// collection.js
/*
- Seeds the collection with Bulbasaur, Charmander, and Squirtle the first time it runs
- Loads and saves the collection to localStorage so catches persist across page reloads
- Provides a Collection class (with methods to check for duplicates and add new Pokémon) and export an instance we can import elsewhere
- Exports a renderCollection() function that wipes and redraws the <div id="collection-container"> based on whatever’s currently in your stored collection
*/

const starterPokemons = [];

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

  if (collection.all.length === 0) {
    container.innerHTML = `
      <p>You don't have any Pokémon yet. <a href="game_page.html">Play the game</a> to catch some!</p>
    `;
    return;
  }

  container.innerHTML = "";
  collection.all.forEach((p) => {
    const card = document.createElement("div");
    card.className = "pokemon-card";

    const image = document.createElement("img");
    image.src = p.img;
    image.alt = p.name;

    const heading = document.createElement("h3");
    heading.textContent = p.nickname || p.name;

    card.append(image, heading);
    container.append(card);
  });
}
