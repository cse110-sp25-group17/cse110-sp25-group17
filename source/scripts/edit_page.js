import { collection, renderCollection } from './collection.js';

document.addEventListener('DOMContentLoaded', () => {
  // Take the id from the URL
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id')); // e.g. 4 for Charmander

  // Look it up in collection
  const pok = collection.all.find(p => p.id === id);
  const container = document.getElementById('card-container');
  container.innerHTML = '';

  // Grab references to the buttons container and its buttons
  const deleteBtn   = document.getElementById('delete-btn');
  const nicknameBtn = document.getElementById('nickname-btn');
  const backBtn     = document.getElementById('back-btn');

  // If Pokémon not found in our collection, show an error & still show Back button
  if (!pok) {
    // Hide only Delete & Nickname
    deleteBtn.style.display   = 'none';
    nicknameBtn.style.display = 'none';

    const heading = document.createElement('h2');
    heading.textContent = 'Pokémon not found in Collection';
    container.appendChild(heading);
    // Back button is already in the DOM, just wire it up:
    backBtn.addEventListener('click', () => {
      window.location.assign('collection.html');
    });
    return;
  }

  // If found, render the selected card
  const card = document.createElement('div');
  card.className = 'pokemon-card';
  
  const imgEl = document.createElement('img');
  imgEl.src = pok.img;
  imgEl.alt = pok.name;

  const nameEl = document.createElement('h3');
  nameEl.textContent = pok.nickname || pok.name;

  card.appendChild(imgEl);
  card.appendChild(nameEl);
  container.appendChild(card);
  // Wire up Delete button
  deleteBtn.addEventListener('click', () => {
    const removed = collection.removeById(id);
    if (!removed) {
      alert('Unable to delete: Pokémon not found');
      return;
    }
    renderCollection();
    window.location.assign('collection.html');
  });

  // Wire up Edit Nickname button
  nicknameBtn.addEventListener('click', () => {
    const newNick = prompt('Enter new nickname:');
    const trimmedNewNick = newNick.trim();

    if (trimmedNewNick.toLowerCase() == pok.name.toLowerCase()) {
      return;
    }
    
    if (!newNick || trimmedNewNick === '') {
      pok.nickname = pok.name;
    }

    pok.nickname = newNick.trim();
    collection._save();
    window.location.assign('collection.html');
  });

  // Wire up Back button
  backBtn.addEventListener('click', () => {
    window.location.assign('collection.html');
  });

  // Change background color and border color of the card based on type
  // API: https://pokeapi.co/api/v2/pokemon/{id}
  // Example: https://pokeapi.co/api/v2/pokemon/4
  const typeColors = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    psychic: '#F85888',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    fairy: '#EE99AC',
    normal: '#A8A878',
    fighting: '#C03028',
    flying: '#A890F0',
    poison: '#A040A0',
    ground: '#E0C068',
    rock: '#B8A038',
    bug: '#A8B820',
  };
  window.addEventListener('DOMContentLoaded', async () => {
    const pokemonDataUrl = `https://pokeapi.co/api/v2/pokemon/` + id;
    try {
      const response = await fetch(pokemonDataUrl);
      const pokemonData = await response.json();
      const type = pokemonData.types[0].type.name;
      card.style.borderColor = typeColors[type];
      card.style.backgroundColor = `${typeColors[type]}60`;
    }
    catch (error) {
      console.error('Error fetching Pokémon data:', error);
    }
  });
});
