let currentPokemon = null;
let selectedAnswer = null;
let deck = [];
let allTypes = [];

// Load all Pokémon types
async function fetchAllTypes() {
  const res = await fetch("https://pokeapi.co/api/v2/type");
  const data = await res.json();
  allTypes = data.results //needs improvement for security(line 10)
  
    .map(t => t.name)
    .filter(name => !["shadow", "unknown"].includes(name));
}



// Load a Pokémon
async function loadPokemon() {
  const id = Math.floor(Math.random() * 150) + 1;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();

  const primaryType = data.types[0].type.name;

  currentPokemon = {
    name: data.name,
    image: data.sprites.front_default,
    type: primaryType
  };

  document.getElementById("pokemon-img").src = currentPokemon.image;
  generateOptions(primaryType);
}

// Shuffle array
function shuffleArray(arr) {
  //ensure that arr is an array
  if (!Array.isArray(arr)) {
    throw new TypeError("Expected an array to shuffle.");
  }
  
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Generate color based on type
function typeColor(type) {
  switch (type) {
    case "fire": return "#ff6633";
    case "water": return "#3399ff";
    case "grass": return "#33cc33";
    case "electric": return "#f9cc00";
    case "poison": return "#aa00ff";
    case "normal": return "#999999";
    case "flying": return "#77ccff";
    case "bug": return "#99cc33";
    case "steel": return "#888888";
    case "psychic": return "#ff3399";
    case "ground": return "#cc9966";
    case "rock": return "#aa9966";
    case "ice": return "#66ccff";
    case "dragon": return "#9966cc";
    case "ghost": return "#6666cc";
    case "dark": return "#444444";
    case "fairy": return "#ffccff";
    case "fighting": return "#cc3333";
    default: return "#d3d3d3";
  }
}

// Generate type buttons
function generateOptions(correctType) {
  let incorrect = allTypes.filter(t => t !== correctType);
  shuffleArray(incorrect);
  const choices = [correctType, ...incorrect.slice(0, 3)];
  shuffleArray(choices);

  const container = document.getElementById("options");
  container.innerHTML = "";

  choices.forEach(type => {
    const btn = document.createElement("button");
    btn.className = "type-btn";
    btn.textContent = type.toUpperCase();
    btn.style.backgroundColor = typeColor(type);

    btn.onclick = () => {
      selectedAnswer = type;
      document.querySelectorAll(".type-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      const result = document.getElementById("result-msg");
      if (selectedAnswer === currentPokemon.type) {
        result.textContent = `Correct! ${currentPokemon.name} added to your deck.`;
        result.style.color = "green";
        deck.push(currentPokemon);
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
  await fetchAllTypes();
  loadPokemon();
});
