import React, { useState, useEffect } from "react";
import "./App.css";

const RECIPES = {
  "crystal+flower": "✨ Shiny Elixir!",
  "flower+mushroom": "🍵 Healing Tea!",
  "crystal+mushroom": "💣 Boom Bomb!",
  "crystal+flower+mushroom": "🧪 Mega Mix Potion!",
  "leaf+stone": "🧂 Forest Dust!",
};

const INGREDIENTS = [
  { name: "mushroom", image: "/assets/mushroom.png" },
  { name: "flower", image: "/assets/flower.png" },
  { name: "crystal", image: "/assets/crystal.png" },
  { name: "potion", image: "/assets/potion-pink.png" }
];

function Ingredient({ ingredient }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", ingredient.name);
  };

  return (
    <img
      className="ingredient"
      src={ingredient.image}
      alt={ingredient.name}
      draggable
      onDragStart={handleDragStart}
    />
  );
}

function Cauldron({ ingredients, onDropIngredient, onClear, onBrewed }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("text/plain");
    onDropIngredient(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const combo = [...ingredients].sort().join("+");
  const result = RECIPES[combo] || (ingredients.length > 0 ? `🫧 Mixing... (${ingredients.join(", ")})` : "🫧 Drag ingredients here to brew!");

  useEffect(() => {
    if (RECIPES[combo]) {
      onBrewed(RECIPES[combo]);
    }
  }, [combo, onBrewed]);

  return (
    <div className="cauldron-area">
      <div className="cauldron" onDrop={handleDrop} onDragOver={handleDragOver}>
        <div className="result sparkle">{result}</div>
        <button className="clear-btn" onClick={onClear}>Clear Cauldron</button>
      </div>
    </div>
  );
}

function RecipeBook() {
  return (
    <div className="recipe-book">
      <h2>📖 Recipe Book</h2>
      <ul>
        {Object.entries(RECIPES).map(([combo, result]) => (
          <li key={combo}><strong>{combo.replace(/\+/g, " + ")}</strong>: {result}</li>
        ))}
      </ul>
    </div>
  );
}

function Inventory({ potions }) {
  return (
    <div className="inventory">
      <h2>🧺 Inventory</h2>
      {potions.length === 0 ? <p>No potions yet!</p> : (
        <ul>
          {potions.map((potion, index) => (
            <li key={index}>{potion}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function App() {
  const [cauldronIngredients, setCauldronIngredients] = useState([]);
  const [potions, setPotions] = useState(() => {
    const saved = localStorage.getItem("cozyPotions");
    return saved ? JSON.parse(saved) : [];
  });
  const [audio] = useState(new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_655fa6a48d.mp3"));

  useEffect(() => {
    audio.loop = true;
    audio.volume = 0.2;
    audio.play().catch(() => {});
  }, [audio]);

  useEffect(() => {
    localStorage.setItem("cozyPotions", JSON.stringify(potions));
  }, [potions]);

  const addIngredient = (name) => {
    setCauldronIngredients([...cauldronIngredients, name]);
  };

  const clearCauldron = () => {
    setCauldronIngredients([]);
  };

  const handleBrewed = (potion) => {
    if (!potions.includes(potion)) {
      setPotions([...potions, potion]);
    }
  };

  return (
    <div className="app">

    <div className="shelves">
      <div className="shelf-column">
        <Ingredient ingredient={INGREDIENTS[0]} /> {/* mushroom */}
        <Ingredient ingredient={INGREDIENTS[1]} /> {/* flower */}
      </div>
      <div className="shelf-column">
        <Ingredient ingredient={INGREDIENTS[2]} /> {/* crystal */}
        <Ingredient ingredient={INGREDIENTS[3]} /> {/* potion */}
      </div>
    </div>

    <Cauldron
      ingredients={cauldronIngredients}
      onDropIngredient={addIngredient}
      onClear={clearCauldron}
      onBrewed={handleBrewed}
    />

    {/* Remove for now:
    <div className="side-panels">
      <RecipeBook />
      <Inventory potions={potions} />
    </div> 
    */}

    </div>
  );
}

export default App;
