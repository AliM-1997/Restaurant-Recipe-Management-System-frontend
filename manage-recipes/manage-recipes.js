const select_resturant = document.querySelectorAll("#resturant-select");
const recipes_table = document.querySelector(".recipes-table");

const fetch_resturant = async () => {
  const response = await fetch(
    "http://localhost/Restaurant-Recipe-Management-System-backend/restaurants/readall.php"
  );

  const data = await response.json();

  data.restaurants.forEach((restaurant) => {
    select_resturant.forEach(
      (select) =>
        (select.innerHTML += `
      <option value=${restaurant.id}>${restaurant.name}</option>
      `)
    );
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
    recipes_table.innerHTML += `<tr id=recipe-${recipe.id}>
    <td scope="col" id="recipe-name">${recipe.name}</td>
    <td scope="col" id="rest-name">${recipe.resturant_name}</td>
    
<td scope="col"><div id="recipe-details" style="width:21rem; height:4rem; overflow-y:auto;">${recipe.details}</div></td>
    <td scope="col"><button id=${recipe.id} class="btn btn-edit btn btn-primary btn-sm mr-3" data-toggle="modal" data-target="#edit-recipeModal">Edit</button><button id=${recipe.id} class="btn-delete btn btn-danger btn-sm mr-3">Delete</button></td>
    </tr>
    `;
  });
  const edit_btn = document.querySelectorAll(".btn-edit");

  edit_btn.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id_recipe = Number(e.target.getAttribute("id"));

      const cur_recipe = document.getElementById(`recipe-${id_recipe}`);

      const arr = [];

      arr.push(cur_recipe.querySelector("#recipe-name").innerText);
      arr.push(cur_recipe.querySelector("#rest-name").innerText);
      arr.push(cur_recipe.querySelector("#recipe-details").innerText);

      const edit_form = document.getElementById("edit-recipeForm");
      //   console.log(edit_form);
      const form_groups = edit_form.querySelectorAll(".form-group");

      form_groups[0]
        .querySelector("#recipe_name")
        .setAttribute("value", arr[0]);

      form_groups[2].querySelector("#details").innerText = arr[2];

      console.log(form_groups[2]);

      const edit_recipeForm = document.getElementById("edit-recipeForm");
      edit_recipeForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const recipeName = edit_recipeForm.querySelector("#recipe_name").value;
        const restaurantId = Number(
          edit_recipeForm.querySelector("#resturant-select").value
        );
        const details = edit_recipeForm.querySelector("#details").value;

        const recipeData = {
          id: id_recipe,
          resturant_id: restaurantId,
          name: recipeName,
          details: details,
        };
        console.log(recipeData);

        try {
          const respone = await fetch(
            "http://localhost/Restaurant-Recipe-Management-System-backend/recipes/update_recipe.php",
            {
              method: "POST",
              headers: {
                "content-Type": "application/json",
              },
              body: JSON.stringify(recipeData),
            }
          );
          if (!respone) {
            console.log("no response from fetching");
          }
          const data = await respone.json();
          console.log(data);
        } catch (error) {
          console.error(error.message);
        }
      });
    });
  });
  const delete_btns = document.querySelectorAll(".btn-delete");

  delete_btns.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id_recipe = Number(e.target.getAttribute("id"));
      console.log(id_recipe);
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
const recipeForm = document.getElementById("add-recipeForm");
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
  console.log(recipeData);

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
