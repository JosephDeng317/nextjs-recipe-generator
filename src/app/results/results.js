"use client";
// pages/results.js

import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Head from "next/head";

export default function Results() {
  // Convert recipes from JSON string back to array
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    try {
      const recipesParam = searchParams.get("recipes");
      if (recipesParam) {
        const parsedRecipes = JSON.parse(decodeURIComponent(recipesParam));
        setRecipes(parsedRecipes);
      }
    } catch (error) {
      console.error("Error parsing recipes:", error);
    }
  }, [searchParams]);
  return (
    <Suspense>
      <div>
        <Head>
          <title>Recipe Results</title>
          <meta
            name="description"
            content="Generated recipes based on your ingredients"
          />
        </Head>

        <div class="m-5">
          <div class="row">
            <h1 class="m-3">Here's your recipes!</h1>
            {recipes.length > 0 ? (
              recipes.map((recipe, index) => (
                <div key={index} className="col-xl-4 col-lg-6 mb-4">
                  <div class="card m-2">
                    <div className="card-body">
                      <h2 className="card-title">{recipe.title}</h2>
                      <h3>Ingredients:</h3>
                      <ul>
                        {recipe.ingredients.map((ingredient, i) => (
                          <li key={i}>{ingredient}</li>
                        ))}
                      </ul>
                      <h3>Instructions:</h3>
                      <p className="card-text">{recipe.instructions}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No recipes found.</p>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
