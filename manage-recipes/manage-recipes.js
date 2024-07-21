const select_resturant = document.getElementById("resturant-select");
const recipes_table = document.querySelector(".recipes-table");

const fetch_resturant = async () => {
  const response = await fetch(
    "http://localhost/Restaurant-Recipe-Management-System-backend/restaurants/readall.php"
  );

  const data = await response.json();

  data.restaurants.forEach((restaurant) => {
    select_resturant.innerHTML += `
      <option value=${restaurant.id}>${restaurant.name}</option>
      `;
  });
};

fetch_resturant();

const fetch_recipes = async () => {
  const response = await fetch(
    "http://localhost/Restaurant-Recipe-Management-System-backend/recipes/read_all_recipes.php"
  );

  const data = await response.json();

  recipes_table.innerHTML = `<tr>
              <th scope="col">Recipe Name</th>
              <th scope="col">Restaurant</th>
              <th scope="col">Details</th>
              <th scope="col">Actions</th>
            </tr>`;

  if (data.recipes === undefined) return;

  data.recipes.forEach((recipe) => {
    recipes_table.innerHTML += `<tr>
    <td scope="col">${recipe.name}</td>
    <td scope="col">${recipe.resturant_name}</td>
    
<td scope="col"><div style="width:21rem; height:4rem; overflow-y:auto;">${recipe.details}</div></td>
    <td scope="col"><button class="btn-edit btn btn-primary btn-sm mr-3">Edit</button><button id=${recipe.id} class="btn-delete btn btn-danger btn-sm mr-3">Delete</button></td>
    </tr>
    `;
  });

  const delete_btns = document.querySelectorAll(".btn-delete");

  delete_btns.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id_recipe = Number(e.target.getAttribute("id"));
      try {
        const response = await fetch(
          "http://localhost/Restaurant-Recipe-Management-System-backend/recipes/delete_recipe.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id_recipe,
            }),
          }
        );

        if (!response) {
          console.log("couldn't delete recipe");
        }
      } catch (error) {
        console.error(error.message);
      }
      fetch_recipes();
    });
  });
};

fetch_recipes();

recipeForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const recipeName = document.getElementById("recipe_name").value;
  const restaurantId = Number(
    document.getElementById("resturant-select").value
  );
  const details = document.getElementById("details").value;
  console.log(recipeName, restaurantId, details);
  const recipeData = {
    resturant_id: restaurantId,
    name: recipeName,
    details: details,
  };

  try {
    const response = await fetch(
      "http://localhost/Restaurant-Recipe-Management-System-backend/recipes/add_recipe.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    alert("Recipe added successfully:", data);
  } catch (error) {
    console.error("Error adding recipe:", error);
  }
  fetch_recipes();
});
