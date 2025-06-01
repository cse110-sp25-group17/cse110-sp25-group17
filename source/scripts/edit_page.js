// scripts/edit_page.js
import { collection } from './collection.js';

let currentIndex = 0;

function renderSingleCard() {
  const container = document.getElementById('collection-container');
  container.innerHTML = '';

  const all = collection.all;

  if (all.length === 0) {
    container.innerHTML = '<p>No Pokémon in your collection.</p>';
    return;
  }

  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex >= all.length) currentIndex = all.length - 1;

  const p = all[currentIndex];

  const card = document.createElement('div');
  card.className = 'pokemon-card';

  const image = document.createElement('img');
  image.src = p.img;
  image.alt = p.name;

  const heading = document.createElement('h3');
  heading.textContent = p.nickname || p.name;

  card.append(image, heading);
  container.appendChild(card);
}

function deleteCurrentCard() {
  if (collection.count === 0) return;

  const deleted = collection.all[currentIndex];
  if (!confirm(`Are you sure you want to delete ${deleted.name}?`)) return;

  // Remove the current Pokémon from the collection
  collection._list.splice(currentIndex, 1);
  collection._save();

  // Adjust index if needed
  if (currentIndex >= collection.count) {
    currentIndex = collection.count - 1;
  }

  renderSingleCard();
}

document.addEventListener('DOMContentLoaded', () => {
  renderSingleCard();

  document.getElementById('next-btn').addEventListener('click', () => {
    if (currentIndex < collection.count - 1) {
      currentIndex++;
      renderSingleCard();
    }
  });

  document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderSingleCard();
    }
  });

  document.getElementById('delete-btn').addEventListener('click', () => {
    deleteCurrentCard();
  });
});