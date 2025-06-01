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
    nickname: ""
  },
  {
    id:       4,
    name:     "Charmander",
    img:      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    nickname: ""
  },
  {
    id:       7,
    name:     "Squirtle",
    img:      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    nickname: ""
  }
];

export class Collection {
  constructor() {
    const raw = localStorage.getItem("pokemonCollection");
    // If nothing in storage, use starterPokemons
    this._list = raw
      ? JSON.parse(raw)
      : [...starterPokemons];
    this._save(); // make sure the seed is persisted
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
    if (this.has(pokemon.id)) return false;
    
    const formattedPokemon = {
      id: pokemon.id,
      name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
      img: pokemon.img,
      nickname: pokemon.nickname || ""
    };
    
    this._list.push(formattedPokemon);
    this._save();
    return true;
  }

  _save() {
      localStorage.setItem("pokemonCollection", JSON.stringify(this._list));
  }

  // Reset the list to just be the starter Pokemons
  clear() {
    this._list = [...starterPokemons];
    this._save();
  }
  // Remove a pokemon by its id and return true if succesfull removed, return false if not found
  removeById(id) {
    const idx = this._list.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this._list.splice(idx, 1);
    this._save();
    return true;
  }
}

export const collection = new Collection();

// Render helper
export function renderCollection() {
  const container = document.getElementById("collection-container");
  if (!container) return;

  container.innerHTML = "";
  collection.all.forEach(p => {
    // Create the links for each pokemon
    const link = document.createElement('a');
    link.href = `edit_page.html?id=${p.id}`; 
    link.className = 'pokemon-card-link';

    // Create the card, and add the image and the name to it
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    const image = document.createElement("img");
    image.src = p.img;
    image.alt = p.name;

    const heading = document.createElement("h3");
    heading.textContent = p.nickname || p.name;
    
    // Append the image and heading to the card, append that card to the link, and then append that to the container
    card.append(image, heading);
    link.appendChild(card);
    container.appendChild(link);
  });
}

