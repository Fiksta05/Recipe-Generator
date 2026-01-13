import { useState, useEffect } from 'react';
import './App.css';

const API_KEY = '92b0cd20cf7e4d5fa490de152ac6b3cb';

interface Recipe {
  id: number;
  title: string;
  image: string;
}

interface RecipeDetails {
  nutrition?: {
    nutrients?: Array<{
      name: string;
      amount: number;
    }>;
  };
  extendedIngredients?: Array<{
    id: number;
    original: string;
  }>;
  analyzedInstructions?: Array<{
    steps?: Array<{
      number: number;
      step: string;
    }>;
  }>;
}

export default function App() {
  const [ingredient, setIngredient] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeDetails, setRecipeDetails] = useState<RecipeDetails | null>(null);
  const [activeTab, setActiveTab] = useState('ingredients');

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
  const handleShowIngredients = (id: number) => {
    alert(`Show ingredients for recipe ${id}`);
  };

  const handleShowSteps = (id: number) => {
    alert(`Show steps for recipe ${id}`);
  };

  useEffect(() => {
    if (selectedRecipe) {
      fetch(`https://api.spoonacular.com/recipes/${selectedRecipe.id}/information?apiKey=${API_KEY}`)
        .then(res => res.json())
        .then(data => setRecipeDetails(data));
    } else {
      setRecipeDetails(null);
    }
  }, [selectedRecipe]);

  return (
    <div className="App">
      
      
        <div className="Search-Bar">
          <input
            type="text"
            placeholder="Type an ingredient..."
            value={ingredient}
            onChange={e => setIngredient(e.target.value)}
          />
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
                <li
                  key={recipe.id}
                  className="recipe-card"
                  onClick={() => setSelectedRecipe(recipe)}
                  style={{ cursor: 'pointer' }}
                >
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

      {selectedRecipe && recipeDetails && (
        <div className="side-panel">
          <h2>{selectedRecipe.title}</h2>
          <img
            src={selectedRecipe.image}
            alt={selectedRecipe.title}
            width={300}
            style={{ borderRadius: '16px', marginBottom: '16px' }}
          />
          <h3>Calories</h3>
          <p>
            {
              recipeDetails.nutrition?.nutrients?.find(
                n => n.name === "Calories" || n.name === "Energy"
              )?.amount ?? "N/A"
            } kcal
          </p>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button
              style={{
                background: activeTab === 'ingredients' ? '#4caf50' : '#eee',
                color: activeTab === 'ingredients' ? '#fff' : '#333',
                borderRadius: '8px',
                border: 'none',
                padding: '8px 16px',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('ingredients')}
            >
              Ingredients
            </button>
            <button
              style={{
                background: activeTab === 'steps' ? '#4caf50' : '#eee',
                color: activeTab === 'steps' ? '#fff' : '#333',
                borderRadius: '8px',
                border: 'none',
                padding: '8px 16px',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('steps')}
            >
              Steps
            </button>
          </div>
          {activeTab === 'ingredients' && (
            <>
              <h3>Ingredients</h3>
              <ul>
                {recipeDetails.extendedIngredients?.map(ingredient => (
                  <li key={ingredient.id}>{ingredient.original}</li>
                ))}
              </ul>
            </>
          )}
          {activeTab === 'steps' && (
            <>
              <h3>Steps</h3>
              <ol>
                {recipeDetails.analyzedInstructions?.[0]?.steps?.map(step => (
                  <li key={step.number}>{step.step}</li>
                ))}
              </ol>
            </>
          )}
          <button 
            onClick={() =>
              window.open(
                `https://spoonacular.com/recipes/${selectedRecipe.title.replace(/ /g, "-")}-${selectedRecipe.id}`
              )
            }
          >
            View Full Recipe
          </button>
          <button id="CloseRecipe-Button" onClick={() => setSelectedRecipe(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}



