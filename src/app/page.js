"use client";

// Import necessary libraries
import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import ThreeJSComponent from "./threejs.js";

// The Page component
export default function Page() {
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [ingredients, setIngredients] = useState([
    { ingredient: "", quantity: "" },
  ]);
  const router = useRouter();

  const showForm = () => setFormVisible(true);
  const hideForm = () => setFormVisible(false);

  const handleInputChange = (index, event) => {
    const values = [...ingredients];
    values[index][event.target.name] = event.target.value;
    setIngredients(values);
  };

  const addMore = () => {
    setIngredients([...ingredients, { ingredient: "", quantity: "" }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ingredients),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const recipes = JSON.stringify(data.recipes);
      // Redirect to the results page with the recipes as a query parameter
      router.push(`/results?recipes=${encodeURIComponent(recipes)}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Head>
        <title>AI Recipe Generator</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/mediaqueries.css" />
      </Head>

      <div className="d-flex justify-content-center mb-5 mt-5">
        {!loading && <h1>I love making recipes, what's in your fridge?</h1>}
        {loading && <h1 className="loading-icon">Working on it...</h1>}
      </div>
      <div id="recipeContainer"></div>
      <div id="dataContainer"></div>
      {!formVisible && (
        <div>
          <div className="d-flex justify-content-center">
            <div id="showFormContainer" className="button-container">
              <button
                className="transparent-button"
                id="showFormButton"
                onClick={showForm}
              >
                <ThreeJSComponent />
              </button>
              <button
                className="hover-icon transparent-button"
                id="hoverIcon"
                onClick={showForm}
              >
                <span className="material-symbols-outlined add-icon unselectable">
                  data_saver_on
                </span>
              </button>
            </div>
          </div>
          <div class="d-flex justify-content-center text-muted">
            <p>Tip: Hover over the fridge!</p>
          </div>
        </div>
      )}

      {formVisible && (
        <div id="form" className="container">
          <form
            id="ingredientsForm"
            // action="http://localhost:3000/api/submit-ingredients"
            // method="POST"
            onSubmit={handleSubmit}
          >
            <div className="d-flex justify-content-end">
              <button
                className="transparent-button m-0"
                id="hideFormButton"
                onClick={hideForm}
                type="button"
              >
                <span className="material-symbols-outlined"> close </span>
              </button>
            </div>
            {ingredients.map((input, index) => (
              <div className="form-group" id="ingredientContainer" key={index}>
                <label htmlFor={`ingredient-${index}`}>Ingredient</label>
                <input
                  type="text"
                  name="ingredient"
                  placeholder="Enter ingredient"
                  value={input.ingredient}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                />
                <label htmlFor={`quantity-${index}`}>Quantity</label>
                <input
                  type="text"
                  name="quantity"
                  placeholder="Enter quantity"
                  value={input.quantity}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                />
              </div>
            ))}
            <button type="button" className="add-more-button" onClick={addMore}>
              Add More
            </button>
            <br />
            <br />
            <input type="submit" value="Submit" id="submitIngredients" />
          </form>
        </div>
      )}
    </>
  );
}
