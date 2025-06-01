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
    if (!newNick || newNick.trim() === '') {
      alert('No nickname entered; edit canceled.');
      return;
    }
    pok.nickname = newNick.trim();
    collection._save();
    window.location.assign('collection.html');
  });

  // Wire up Back button
  backBtn.addEventListener('click', () => {
    window.location.assign('collection.html');
  });
});
