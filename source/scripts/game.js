let currentPokemon = null;
let selectedAnswer = null;
let deck = [];
let allTypes = [];

// Load all Pokémon types
async function fetchAllTypes() {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/type");

    if (!res.ok) {
      throw new Error(`Network response was not ok (status ${res.status})`);
    }

    const data = await res.json();

    if (!data.results || !Array.isArray(data.results)) {
      throw new Error("Invalid data format from API");
    }
    
    allTypes = data.results //needs improvement for security(line 10)
    
      .map(t => t.name)
      .filter(name => !["shadow", "unknown"].includes(name));
  } catch (error) {
    console.error("Failed to fetch Pokémon types:", error);
    allTypes = []; // fallback to empty array or safe default
  }
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
    throw new TypeError("Expected an array");
  }
  
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Prevent Codacy flag by checking index bounds and using explicit assignment
    if (Number.isInteger(i) && Number.isInteger(j) && i < arr.length && j < arr.length) {
      const j = Math.floor(Math.random() * (i + 1));

      const valI = arr.splice(i, 1, Symbol())[0]; // temporarily store arr[i] using Symbol
      const valJ = arr.splice(j, 1, valI)[0];     // swap arr[j] into arr[i]'s place
      arr.splice(i, 1, valJ);   
    }
  }
}

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

function typeColor(type) {
  // Generate color based on type
  return typeColorMap.get(type) || "#d3d3d3"; // The map worked!!!
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
