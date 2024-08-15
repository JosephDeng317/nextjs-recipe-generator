import { config } from "dotenv";
config();

import OpenAI from "openai";

const apiKey = process.env.API_KEY;
const apiUrl = process.env.API_URL;

const openai = new OpenAI({
  organization: "org-Xo4GFbGVbz8FiZ8OkZsoORqc",
  apiKey: process.env.API_KEY,
});

import { NextResponse } from "next/server";
// Import your helper functions or libraries if needed
// import { sendIngredients } from 'path/to/your/utility';

export async function POST(request) {
  try {
    const ingredients = await request.json(); // Retrieve JSON data from request
    const ingredientsWithQuantities = [];
    for (let i = 0; i < ingredients.length; i++) {
      ingredientsWithQuantities.push(
        ingredients[i].quantity + " " + ingredients[i].ingredient
      );
    }
    console.log("Ingredients received:", ingredientsWithQuantities);

    // Example of processing data (you should adjust based on your implementation)
    const data = await sendIngredients(ingredientsWithQuantities); // Assuming sendIngredients is a function you've defined
    console.log("Generated recipes:", data);

    const gen_recipes = data.recipes; // Process the response to extract recipes

    // Respond with JSON data
    return NextResponse.json({ recipes: gen_recipes });
  } catch (error) {
    console.error("Error generating recipes:", error);
    return NextResponse.json(
      { error: "An error occurred while generating recipes." },
      { status: 500 }
    );
  }
}

async function getResponse(data) {
  const payload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: data }],
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    const messageContent = responseData.choices[0].message.content;
    console.log("Response from API:", messageContent);
    return JSON.parse(messageContent); // Assuming the response is a JSON string
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function mockGetResponse(prompt) {
  // Simulate an API call with a timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        recipes: [
          {
            title: "Chicken and Broccoli Stir Fry",
            ingredients: [
              "1 Chicken Breast",
              "1 Broccoli",
              "Salt",
              "Pepper",
              "Soy Sauce",
              "Garlic",
            ],
            instructions:
              "Cook chicken, add broccoli, season with salt, pepper, soy sauce, and garlic.",
          },
          {
            title: "Tomato and Lemon Pork Chops",
            ingredients: [
              "2 Pork Chops",
              "3 Tomatoes",
              "1 Lemon",
              "Salt",
              "Pepper",
              "Olive Oil",
            ],
            instructions:
              "Sear pork chops, add tomatoes and lemon juice, season with salt and pepper.",
          },
          // Add more recipes as needed
        ],
      });
    }, 1000);
  });
}

async function sendIngredients(ingredients) {
  const prompt =
    ingredients +
    ", provide some recipes that can be created using these items, assume that we have access to salt and pepper as seasoning, but if more seasoning should be added please specify. Note that not all of the ingredients have to be used, for example, if there are 6 eggs, it is okay to just use 3 eggs but please specify in the ingredients list. Return the recipes as a JSON object and please use this format {recipes: [{title: 'title', ingredients: ['i1', 'i2'], instructions: 'instructions'}]}";
  const data = await getResponse(prompt);
  return data;
}
