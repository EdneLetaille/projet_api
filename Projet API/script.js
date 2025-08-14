const tableBody = document.querySelector("table tbody");
const searchInput = document.getElementById("search");
const cityFilter = document.getElementById("cityFilter");
const toggleThemeBtn = document.getElementById("toggleTheme");

let usersData = []; // Données originales
let filteredData = []; // Données filtrées

// Charger les données depuis l'API
fetch("https://jsonplaceholder.typicode.com/users")
  .then(response => response.json())
  .then(users => {
    usersData = users;
    filteredData = users;
    renderTable(filteredData);
    populateCityFilter(usersData);
  })
  .catch(err => console.error("Erreur chargement API :", err));

// Fonction pour afficher les données dans le tableau
function renderTable(data) {
  tableBody.innerHTML = ""; // Vider le tableau
  data.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td><a href="http://${user.website}" target="_blank">${user.website}</a></td>
      <td>${user.address.street}, ${user.address.city}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Remplir la liste des villes dans le filtre
function populateCityFilter(data) {
  const cities = [...new Set(data.map(user => user.address.city))];
  cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    cityFilter.appendChild(option);
  });
}

// Recherche dynamique
searchInput.addEventListener("input", () => {
  applyFilters();
});

// Filtre par ville
cityFilter.addEventListener("change", () => {
  applyFilters();
});

// Fonction pour appliquer recherche + filtre
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCity = cityFilter.value;

  filteredData = usersData.filter(user => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm) ||
      user.username.toLowerCase().includes(searchTerm);
    const matchCity = selectedCity ? user.address.city === selectedCity : true;
    return matchSearch && matchCity;
  });

  renderTable(filteredData);
}

// Mode clair/sombre
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleThemeBtn.textContent = document.body.classList.contains("dark")
    ? "☀️ Mode clair"
    : "🌙 Mode sombre";
});
