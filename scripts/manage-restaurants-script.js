document.addEventListener("DOMContentLoaded", function () {
  const restaurantForm = document.getElementById("restaurantForm");
  const restaurantList = document.getElementById("restaurantList");
  const restaurantModalLabel = document.getElementById("restaurantModalLabel");
  const restaurantId = document.getElementById("restaurantId");

  const fetchData = async () => {
    const response = await fetch(
      "http://localhost/Restaurant-Recipe-Management-System-backend/restaurants/readall.php"
    );
    const data = await response.json();
    restaurantList.innerHTML = ""; // Clear the list before appending
    data.restaurants.forEach((restaurant) => {
      restaurantList.innerHTML += `
              <tr id="restaurant-${restaurant.id}">
                  <td>${restaurant.name}</td>
                  <td>${restaurant.location}</td>
                  <td>${restaurant.cuisine_type}</td>
                  <td>
                      <button class="btn btn-primary btn-sm mr-3 edit-btn" data-id="${restaurant.id}">Edit</button>
                      <button class="btn btn-danger btn-sm delete-btn" data-id="${restaurant.id}">Delete</button>
                  </td>
              </tr>`;
    });

    addEventListenersToButtons();
  };

  restaurantForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(restaurantForm);
    const formObject = Object.fromEntries(formData.entries());
    const url = formObject.id ? "update.php" : "create.php"; // Adjust the URL as needed

    try {
      const response = await fetch(
        `http://localhost/Restaurant-Recipe-Management-System-backend/restaurants/${url}`,
        {
          method: "POST",
          body: JSON.stringify(formObject),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        $("#restaurantModal").modal("hide");
        restaurantForm.reset();
        if (formObject.id) {
          // If updating, replace the existing row
          document.querySelector(`#restaurant-${formObject.id}`).innerHTML = `
                      <td>${formObject.name}</td>
                      <td>${formObject.location}</td>
                      <td>${formObject.cuisine_type}</td>
                      <td>
                          <button class="btn btn-primary btn-sm mr-3 edit-btn" data-id="${formObject.id}">Edit</button>
                          <button class="btn btn-danger btn-sm delete-btn" data-id="${formObject.id}">Delete</button>
                      </td>`;
        } else {
          // If creating, append a new row
          restaurantList.innerHTML += `
                      <tr id="restaurant-${result.id}">
                          <td>${formObject.name}</td>
                          <td>${formObject.location}</td>
                          <td>${formObject.cuisine_type}</td>
                          <td>
                              <button class="btn btn-primary btn-sm mr-3 edit-btn" data-id="${result.id}">Edit</button>
                              <button class="btn btn-danger btn-sm delete-btn" data-id="${result.id}">Delete</button>
                          </td>
                      </tr>`;
        }
        addEventListenersToButtons();
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  });

  const addEventListenersToButtons = () => {
    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", async function () {
        const id = this.getAttribute("data-id");
        try {
          const response = await fetch(
            `http://localhost/Restaurant-Recipe-Management-System-backend/restaurants/read.php?id=${id}`
          );
          const restaurant = await response.json();
          if (restaurant) {
            restaurantModalLabel.textContent = "Edit Restaurant";
            restaurantId.value = restaurant.id;
            restaurantForm.name.value = restaurant.name;
            restaurantForm.location.value = restaurant.location;
            restaurantForm.cuisine_type.value = restaurant.cuisine_type;
            $("#restaurantModal").modal("show");
          }
        } catch (error) {
          console.error("Error fetching restaurant data:", error);
        }
      });
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async function () {
        const id = this.getAttribute("data-id");
        try {
          const response = await fetch(
            `http://localhost/Restaurant-Recipe-Management-System-backend/restaurants/delete.php`,
            {
              method: "POST",
              body: JSON.stringify({ id }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const result = await response.json();
          if (result.status === "success") {
            document.getElementById(`restaurant-${id}`).remove();
          } else {
            console.error(result.message);
          }
        } catch (error) {
          console.error("Error deleting restaurant:", error);
        }
      });
    });
  };

  fetchData();
});
