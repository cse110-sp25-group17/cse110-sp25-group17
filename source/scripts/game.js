// game.js
/*
- Loads a random Pokemon and sets its image in the UI (loadPokemon)
- Shuffles and displays four type buttons, one correct and three wrongs (generateOptions + shuffleArray)
- Handles the users answer, checks it against the current Pokémon’s  type, and shows a green “Correct!” or red “Oops” message.
- On a correct guess, calls collection.add() to persist the catch and then renderCollection() to update the caught-Pokémon display.
- After a short delay, clears the message and button state, then picks a new random Pokémon to continue the quiz.
*/

import { collection, renderCollection } from './collection.js';

let currentPokemon = null;
let selectedAnswer = null;
// Gen I types (only these appear among Pokémon 1–151)
const allTypes = [
   "bug", "dragon", "electric", "fighting", "fire", 
   "flying", "ghost", "grass", "ground", "ice",
   "normal", "poison", "psychic", "rock", "water"
];

// Map the colors for each type
const typeColorMap = new Map([
  ["fire", "#ff6633"],
  ["water", "#3399ff"],
  ["grass", "#33cc33"],
  ["electric", "#f9cc00"],
  ["poison", "#aa00ff"],
  ["normal", "#999999"],
  ["flying", "#77ccff"],
  ["bug", "#99cc33"],
  ["steel", "#888888"],
  ["psychic", "#ff3399"],
  ["ground", "#cc9966"],
  ["rock", "#aa9966"],
  ["ice", "#66ccff"],
  ["dragon", "#9966cc"],
  ["ghost", "#6666cc"],
  ["dark", "#444444"],
  ["fairy", "#ffccff"],
  ["fighting", "#cc3333"]
]);


// Load a Pokémon
async function loadPokemon() {
  console.log('Loading new Pokemon...');
  const id = Math.floor(Math.random() * 150) + 1;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();

  const primaryType = data.types[0].type.name;
  console.log('Loaded Pokemon:', data.name, 'with type:', primaryType);

  currentPokemon = {
    id:    data.id,
    name:  data.name,
    image: data.sprites.front_default,
    type:  primaryType
  };

  document.getElementById("pokemon-img").src = currentPokemon.image;
  generateOptions(primaryType);
}

// Shuffle array 
function shuffleArray(arr) {
  //ensure that arr is an array
  if (!Array.isArray(arr)) {
    throw new TypeError("Expected an array");
  }
  
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // manual swap instead of [arr[i], arr[j]] = [..]
    const tmp     = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;

}


function typeColor(type) {
  // Generate color based on type
  return typeColorMap.get(type) || "#d3d3d3"; // The map worked!!!
}

// Generate type buttons
function generateOptions(correctType) {
  console.log('Generating options for type:', correctType);
  
  if (!correctType || !allTypes.includes(correctType)) {
    console.error('Invalid type received:', correctType);
    return;
  }

  // 1) Get all wrong types
  const wrongTypes = allTypes.filter(type => type !== correctType);
  console.log('Available wrong types:', wrongTypes);
  
  // 2) Select exactly 3 wrong types
  const threeWrongTypes = shuffleArray([...wrongTypes]).slice(0, 3);
  console.log('Selected wrong types:', threeWrongTypes);
  
  // 3) Create array with correct type and 3 wrong types, then shuffle
  const allChoices = shuffleArray([correctType, ...threeWrongTypes]);
  console.log('Final shuffled choices:', allChoices);

  // 4) Clear and rebuild the options container
  const container = document.getElementById("options");
  container.innerHTML = "";
  allChoices.forEach((type, index) => {
    if (typeof type !== 'string') {
      console.error('Invalid type value:', type);
      return;
    }
    console.log(`Creating button ${index + 1}/4 for type: ${type}`);
    const btn = document.createElement("button");
    btn.className = "type-btn";
    btn.textContent = type.toUpperCase();
    btn.style.backgroundColor = typeColor(type);

    btn.onclick = () => {
      console.log(`Button clicked: ${type}, Correct type: ${currentPokemon.type}`);
      selectedAnswer = type;
      document.querySelectorAll(".type-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      const result = document.getElementById("result-msg");
      if (selectedAnswer === currentPokemon.type) {
        result.textContent = `Correct! ${currentPokemon.name} added to your collection.`;
        result.style.color = "green";

        // Add persist to localStorage
        const caught = collection.add({
          id:       currentPokemon.id,
          name:     currentPokemon.name,
          img:      currentPokemon.image,
          nickname: currentPokemon.nickname || ""
        });

        // re-render your UI if it was actually new
        if (caught) renderCollection();

      } else {
        result.textContent = "Oops, next time :(";
        result.style.color = "red";
      }

      setTimeout(() => {
        selectedAnswer = null;
        result.textContent = "";
        document.querySelectorAll(".type-btn").forEach(b => b.classList.remove("selected"));
        loadPokemon();
      }, 2000);
    };

    container.appendChild(btn);
  });
}


// Init
document.addEventListener("DOMContentLoaded", async () => {
  loadPokemon();
});

export { loadPokemon, generateOptions };