document.addEventListener("DOMContentLoaded", function () {
  const recipeForm = document.getElementById("recipeForm");

  recipeForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const recipeName = document.getElementById("recipe_name").value;
    const restaurantId = document.getElementById("restaurant_id").value;
    const details = document.getElementById("details").value;

    const recipeData = {
      resturant_id: restaurantId,
      name: recipeName,
      details: details,
    };
    console.log(recipeData);

    try {
      const response = await fetch(
        "http://localhost/Restaurant-Recipe-Management-System-backend/recipes/add_recipe.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: recipeData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Recipe added successfully:", data);
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  });
});
