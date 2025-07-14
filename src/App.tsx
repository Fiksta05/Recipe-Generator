import React, { useState } from 'react';
import './App.css';

const API_KEY = '92b0cd20cf7e4d5fa490de152ac6b3cb';

export default function App() {
  const [ingredient, setIngredient] = useState('');
  const [recipes, setRecipes] = useState([]);

  const handleCookClick = async () => {
    if (!ingredient) return;
    const url = `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${encodeURIComponent(ingredient)}&number=5&apiKey=${API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setRecipes(data.results || []);
    } catch (error) {
      alert('Error fetching recipes');
    }
  };

  // Add these handlers to avoid errors
  const handleShowIngredients = (id) => {
    alert(`Show ingredients for recipe ${id}`);
  };

  const handleShowSteps = (id) => {
    alert(`Show steps for recipe ${id}`);
  };

  return (
    <div className="App">
      <h1>Recipe Generator</h1>
      <div>Search Bar
        <div className="Search-Bar">
          <input
            type="text"
            placeholder="Type an ingredient..."
            value={ingredient}
            onChange={e => setIngredient(e.target.value)}
          />
        </div>
      </div>

      <div className="Buttons">
        <div className="Search-Bar-Button">
          <button
            id="Cook-Button"
            onClick={handleCookClick}
          >
            +
            <span className="ripple"></span>
          </button>
        </div>
      </div>

      <div>
        {recipes.length > 0 && (
          <div>
            <ul id="recipe-Cards">
              {recipes.map((recipe) => (
                <li key={recipe.id} className="recipe-card">
                  <h3>{recipe.title}</h3>
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      width={150}
                      style={{ borderRadius: '10px' }}
                    />
                  )}
                  <div className="Card-Buttons">
                    <button id="Ingredients-Button" onClick={() => handleShowIngredients(recipe.id)}>Ingredients</button>
                    <button id="Steps-Button" onClick={() => handleShowSteps(recipe.id)}>Steps</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div> 
  );
}




