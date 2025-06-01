// game.js
/*
- Loads a random Pokemon and sets its image in the UI (loadPokemon)
- Shuffles and displays four type buttons, one correct and three wrongs (generateOptions + shuffleArray)
- Handles the users answer, checks it against the current Pokémon’s  type, and shows a green “Correct!” or red “Oops” message.
- On a correct guess, calls collection.add() to persist the catch and then renderCollection() to update the caught-Pokémon display.
- After a short delay, clears the message and button state, then picks a new random Pokémon to continue the quiz.
*/

import { collection, renderCollection } from "./collection.js";

let currentPokemon = null;
let selectedAnswer = null;
let currentStage = "type";

const allTypes = [
  "bug", "dragon", "electric", "fighting", "fire", "flying",
  "ghost", "grass", "ground", "ice", "normal", "poison",
  "psychic", "rock", "water"
];

const nameColors = ["#3399ff", "#33cc33", "#ff6633", "#cc3333"]; // blue, green, orange, red

const typeColorMap = new Map([
  ["fire", "#ff6633"], ["water", "#3399ff"], ["grass", "#33cc33"],
  ["electric", "#f9cc00"], ["poison", "#aa00ff"], ["normal", "#999999"],
  ["flying", "#77ccff"], ["bug", "#99cc33"], ["steel", "#888888"],
  ["psychic", "#ff3399"], ["ground", "#cc9966"], ["rock", "#aa9966"],
  ["ice", "#66ccff"], ["dragon", "#9966cc"], ["ghost", "#6666cc"],
  ["dark", "#444444"], ["fairy", "#ffccff"], ["fighting", "#cc3333"],
]);

async function loadPokemon() {
  // Reset result message
  const result = document.getElementById("result-msg");
  result.textContent = "";
  result.classList.remove("success", "error");

  const id = Math.floor(Math.random() * 150) + 1;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();

  const primaryType = data.types[0].type.name;
  currentPokemon = {
    id: data.id,
    name: data.name,
    image: data.sprites.front_default,
    type: primaryType,
  };

  document.getElementById("pokemon-img").src = currentPokemon.image;
  currentStage = "type";
  generateTypeOptions();
}

function shuffleArray(arr) {
    //ensure that arr is an array
    if (!Array.isArray(arr)) {
      throw new TypeError("Expected an array");
    }  
  return [...arr].sort(() => Math.random() - 0.5);
}

function createOptionButton(label, color, onClick, isNameStage = false) {
  const btn = document.createElement("button");
  btn.className = "type-btn";
  btn.textContent = label.toUpperCase();
  if (isNameStage) {
    btn.classList.add("name-stage");
  } else {
    btn.style.backgroundColor = color;
  }
  btn.onclick = onClick;
  return btn;
}

function disableAllButtons() {
  document.querySelectorAll(".type-btn").forEach((b) => b.disabled = true);
}

function enableAllButtons() {
  document.querySelectorAll(".type-btn").forEach((b) => {
    b.disabled = false;
    b.classList.remove("selected");
  });
}

function clearOptions() {
  document.getElementById("options").innerHTML = "";
}

function updateResultMessage(message, status) {
  const result = document.getElementById("result-msg");
  result.textContent = message;
  result.classList.remove("success", "error");
  if (status) result.classList.add(status); // add 'success' or 'error'
}

function generateTypeOptions() {
  const wrongTypes = allTypes.filter((type) => type !== currentPokemon.type);
  const threeWrongTypes = shuffleArray(wrongTypes).slice(0, 3);
  const allChoices = shuffleArray([currentPokemon.type, ...threeWrongTypes]);

  clearOptions();
  const container = document.getElementById("options");
  allChoices.forEach((type) => {
    const btn = createOptionButton(type, typeColorMap.get(type) || "#d3d3d3", () => handleAnswer(type));
    container.appendChild(btn);
  });
}

async function generateNameOptions() {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`);
  const data = await response.json();
  const allNames = data.results.map((p) => p.name).filter((n) => n !== currentPokemon.name);
  const threeWrongNames = shuffleArray(allNames).slice(0, 3);
  const allChoices = shuffleArray([currentPokemon.name, ...threeWrongNames]);

  clearOptions();
  const container = document.getElementById("options");
  allChoices.forEach((name, index) => {
    const color = nameColors[index % nameColors.length]; // cycle through the palette
    const btn = createOptionButton(name, color, () => handleAnswer(name));
    container.appendChild(btn);
  });
}

async function handleAnswer(choice) {
  disableAllButtons();

  if (currentStage === "type") {
    if (choice === currentPokemon.type) {
      updateResultMessage("Correct type! Now guess the name.", "success");
      setTimeout(async () => {
        updateResultMessage("What's the name of this Pokémon?", "success");
        currentStage = "name";
        await generateNameOptions();
      }, 1500);
    } else {
      updateResultMessage("Oops, wrong type!", "error");
      setTimeout(() => {
        enableAllButtons();
        loadPokemon();
      }, 2000);
    }
  } else if (currentStage === "name") {
    if (choice === currentPokemon.name) {
      const capitalizedName = currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1);
      updateResultMessage(`Correct! ${capitalizedName} added to your collection.`, "success");
      const caught = collection.add({
        id: currentPokemon.id,
        name: currentPokemon.name,
        img: currentPokemon.image,
        nickname: currentPokemon.nickname || "",
      });
      if (caught) renderCollection();
    } else {
      updateResultMessage("Oops, wrong name!", "error");
    }
    setTimeout(() => {
      enableAllButtons();
      loadPokemon();
    }, 2000);
  }
}

document.addEventListener("DOMContentLoaded", loadPokemon);

export { loadPokemon, generateTypeOptions as generateOptions };
