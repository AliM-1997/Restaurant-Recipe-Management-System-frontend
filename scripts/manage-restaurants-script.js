const restaurants_table = document.querySelector(".restaurants-table");
// console.log(restaurants_table);
const displayRestaurants = async () => {
  const response = await fetch(
    "http://localhost/Restaurant-Recipe-Management-System-backend/restaurants/readall.php"
  );
  const data = await response.json();
  data.restaurants.forEach((restaurant) => {
    // console.log(restaurant);
    restaurants_table.innerHTML += `<tr id=${restaurant.id}>
    <td scope="col">${restaurant.name}</td>
    <td scope="col">${restaurant.location}</td>
    <td scope="col">${restaurant.cuisine_type}</td>
    <td scope="col"><button class="btn btn-primary btn-sm mr-3">Edit</button><button class="btn btn-danger btn-sm mr-3">Delete</button></td>
    </tr>`;
  });
};

displayRestaurants();
