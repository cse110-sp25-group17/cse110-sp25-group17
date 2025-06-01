// scripts/edit.js
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
  const buttonsDiv  = document.getElementById('buttons');
  const deleteBtn   = document.getElementById('delete-btn');
  const nicknameBtn = document.getElementById('nickname-btn');
  const backBtn     = document.getElementById('back-btn');

  // If Pokémon not found in our collection, show an error & still show Back button
  if (!pok) {
    // Hide only Delete & Nickname; keep Back visible
    deleteBtn.style.display   = 'none';
    nicknameBtn.style.display = 'none';
    backBtn.style.display     = 'block';
    buttonsDiv.style.display  = 'flex'; // ensure the container itself is visible

    container.innerHTML = `
      <h2>Pokémon not found in Collection</h2>
    `;
    // Back button is already in the DOM, just wire it up:
    backBtn.addEventListener('click', () => {
      window.location.href = 'collection.html';
    });
    return;
  }

  // If found, render the selected card
  const card = document.createElement('div');
  card.className = 'pokemon-card';
  card.innerHTML = `
    <img src="${pok.img}" alt="${pok.name}" />
    <h3>${pok.nickname || pok.name}</h3>
  `;
  container.appendChild(card);

  // Show Delete & Nickname & Back buttons, all stacked in #buttons
  deleteBtn.style.display   = 'block';
  nicknameBtn.style.display = 'block';
  backBtn.style.display     = 'block';
  buttonsDiv.style.display  = 'flex';

  // Wire up Delete button
  deleteBtn.addEventListener('click', () => {
    const removed = collection.removeById(id);
    if (!removed) {
      alert('Unable to delete: Pokémon not found');
      return;
    }
    renderCollection();
    window.location.href = 'collection.html';
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
    window.location.href = 'collection.html';
  });

  // Wire up Back button
  backBtn.addEventListener('click', () => {
    window.location.href = 'collection.html';
  });
});
