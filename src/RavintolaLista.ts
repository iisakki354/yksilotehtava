'use strict';
import '../public/main.css';
import {restaurantModal, restaurantRow} from './components.ts';
import {fetchData} from './Fetchdata.ts';
import {apiURL} from './variables.ts';
import * as L from 'leaflet';

const kohde = document.querySelector('tbody') as HTMLTableSectionElement;
const modaali = document.querySelector('dialog') as HTMLDialogElement;
const info = document.querySelector('#info') as HTMLElement;
const closeModal = document.querySelector('#close-modal') as HTMLElement;
const logoutBTN = document.querySelector('#logout-button') as HTMLElement;

const kutsuRavintolat = async () => {
  const restaurants = await fetchRestaurants();
  teeRavintolaLista(restaurants);
};

// avatun ravintolan objekti tallentuu tähän
let openedRestaurant = {} as Restaurant;

let map: L.Map;
let markers: L.Marker[] = [];
let showWeekly = false; // Toggle to switch between daily and weekly menu

// Initialize map and load restaurants on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('search-button')
    ?.addEventListener('click', handleSearch);
  initializeMap();
  loadRestaurants();

  logoutBTN.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
  });

  // Event listeners for showing daily or weekly menu
  document.getElementById('show-weekly-menu')?.addEventListener('click', () => {
    showWeekly = true;
    console.log('Weekly menu toggled:', showWeekly); // Add this to verify toggle
    updateMenuDisplay();
  });

  document.getElementById('show-daily-menu')?.addEventListener('click', () => {
    showWeekly = false;
    console.log('Daily menu toggled:', showWeekly); // Add this to verify toggle
    updateMenuDisplay();
  });
});

// Function to update the menu display
async function updateMenuDisplay() {
  const weeklyMenu = document.getElementById('weekly-menu');
  const dailyMenu = document.getElementById('daily-menu');

  console.log('showWeekly:', showWeekly); // Debug message

  if (showWeekly) {
    weeklyMenu?.classList.remove('hidden');
    dailyMenu?.classList.add('hidden');
  } else {
    weeklyMenu?.classList.add('hidden');
    dailyMenu?.classList.remove('hidden');
  }

  if (showWeekly) {
    console.log('Fetching weekly menu for:', openedRestaurant); // Debug message
    await displayWeeklyMenu(openedRestaurant._id);
  } else {
    console.log('Fetching daily menu for:', openedRestaurant); // Debug message
    await displayDailyMenu(openedRestaurant._id, openedRestaurant);
  }
}

// Function for searching restaurants
function handleSearch(): void {
  const searchInput = (
    document.getElementById('search-input') as HTMLInputElement
  ).value.toLowerCase();
  const rows = document.querySelectorAll('tbody tr');
  const filteredRestaurants: Restaurant[] = [];

  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    const [name, company, address] = Array.from(cells).map(
      (cell) => cell.textContent?.toLowerCase() || ''
    );

    if (
      name.includes(searchInput) ||
      company.includes(searchInput) ||
      address.includes(searchInput)
    ) {
      (row as HTMLElement).style.display = '';
      filteredRestaurants.push({
        _id: (row as HTMLElement).dataset.id!,
        companyId: (row as HTMLElement).dataset.companyId!,
        name: cells[0].textContent!,
        address: cells[2].textContent!,
        postalCode: (row as HTMLElement).dataset.postalCode!,
        city: (row as HTMLElement).dataset.city!,
        phone: (row as HTMLElement).dataset.phone!,
        location: {
          type: 'Point',
          coordinates: [
            parseFloat((row as HTMLElement).dataset.longitude!),
            parseFloat((row as HTMLElement).dataset.latitude!),
          ],
        },
        company: cells[1].textContent!,
      });
    } else {
      (row as HTMLElement).style.display = 'none';
    }
  });

  updateMapMarkers(filteredRestaurants);

  if (filteredRestaurants.length > 0) {
    const {coordinates} = filteredRestaurants[0].location;
    const [longitude, latitude] = coordinates;
    if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
      map.setView([latitude, longitude], 13);
    }
  }
}

// Function for fetching restaurants
async function fetchRestaurants(): Promise<Restaurant[]> {
  try {
    const response = await fetch(apiURL + '/api/v1/restaurants');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch restaurants:', error);
    return [];
  }
}

// Load restaurants and add markers to the map
async function loadRestaurants(): Promise<void> {
  const restaurants = await fetchRestaurants();
  restaurants.forEach((restaurant) => {
    const {_id, name, company, address, location} = restaurant;
    const [longitude, latitude] = location.coordinates;
    const row = restaurantRow({name, company, address});
    (row as HTMLElement).dataset.id = _id;
    (row as HTMLElement).dataset.latitude = latitude.toString();
    (row as HTMLElement).dataset.longitude = longitude.toString();
    kohde.appendChild(row);

    if (latitude && longitude) {
      const marker = L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`<b>${name}</b><br>${address}`);
      markers.push(marker);
    }
  });
}

// Initialize map view centered on Helsinki
async function initializeMap(): Promise<void> {
  map = L.map('map').setView([60.1699, 24.9384], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  }).addTo(map);

  const restaurants = await fetchRestaurants();
  updateMapMarkers(restaurants);
}

// Update map markers based on restaurant locations
function updateMapMarkers(restaurants: Restaurant[]): void {
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];

  restaurants.forEach((restaurant) => {
    const {location, name, address} = restaurant;
    const [longitude, latitude] = location.coordinates;

    if (latitude && longitude) {
      const marker = L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`<b>${name}</b><br>${address}`);
      markers.push(marker);
    }
  });
}

const username = localStorage.getItem('username');

if (username) {
  console.log(`User ${username} is logged in`);
  const usernameElements = document.querySelectorAll('#name');
  usernameElements.forEach((element) => {
    element.innerHTML = username;
  });
}

// Load restaurant list
document.addEventListener('DOMContentLoaded', kutsuRavintolat);

// Populate restaurant table with rows
const teeRavintolaLista = (restaurants: Restaurant[]): void => {
  kohde.innerHTML = '';

  restaurants.sort((a, b) => a.name.localeCompare(b.name));

  restaurants.forEach((restaurant) => {
    if (restaurant) {
      const {_id} = restaurant;
      openedRestaurant = restaurant;

      const rivi = restaurantRow(restaurant);
      (rivi as HTMLElement).dataset.latitude =
        restaurant.location.coordinates[1].toString();
      (rivi as HTMLElement).dataset.longitude =
        restaurant.location.coordinates[0].toString();

      rivi.addEventListener('click', async () => {
        modaali.showModal();
        info.innerHTML = '<div>Ladataan...</div>';

        const korostetut = document.querySelectorAll('.highlight');
        korostetut.forEach((korostettu) => {
          korostettu.classList.remove('highlight');
        });

        rivi.classList.add('highlight');
        openedRestaurant = restaurant;
        try {
          if (showWeekly) {
            console.log('Fetching weekly menu for:', _id); // Debug message
            await displayWeeklyMenu(_id);
          } else {
            console.log('Fetching daily menu for:', _id); // Debug message
            await displayDailyMenu(_id, restaurant);
          }
        } catch (error) {
          console.error('Error fetching menu:', error);
          info.innerHTML = '<div>Virhe ladattaessa ruokalistaa.</div>';
        }
      });

      kohde.append(rivi);
    }
  });
};

closeModal.addEventListener('click', () => {
  modaali.close();
});

// Display Daily Menu
async function displayDailyMenu(_id: string, restaurant: Restaurant) {
  const paivanLista = await fetchData<DailyMenu>(
    apiURL + `/api/v1/restaurants/daily/${_id}/fi`
  );

  const currentDate = new Date().toLocaleDateString('fi-FI', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const menuItems = paivanLista.courses.map((course: Course) => ({
    name: course.name,
    price: course.price,
    diets: course.diets || '',
  }));

  const ravintolaHTML = restaurantModal(restaurant, menuItems);

  info.innerHTML = '';
  info.insertAdjacentHTML('beforeend', `<p>${currentDate}</p>${ravintolaHTML}`);
}

// Fetch and display Weekly Menu
async function displayWeeklyMenu(restaurantId: string): Promise<void> {
  try {
    const daysOfWeek = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    let menuHTML = '';

    for (const day of daysOfWeek) {
      const dailyMenu = await fetchDailyMenuForDay(restaurantId, day);
      menuHTML += `<h4>${day}</h4>`;

      if (dailyMenu.courses.length === 0) {
        menuHTML += '<div>No menu available</div>';
      } else {
        dailyMenu.courses.forEach((course) => {
          menuHTML += `
            <div>
              <p><strong>${course.name || 'Ei ilmoitettu'}</strong></p>
              <p>Hinta: ${course.price || 'Ei ilmoitettu'}</p>
              <p>Allergeenit: ${course.diets || 'Ei ilmoitettu'}</p>
            </div>
          `;
        });
      }
    }

    info.innerHTML = menuHTML;
  } catch (error) {
    console.error('Error displaying weekly menu:', error);
    info.innerHTML = '<div>Virhe ladattaessa viikon ruokalistaa.</div>';
  }
}

// Fetch Daily Menu for a specific day
async function fetchDailyMenuForDay(
  restaurantId: string,
  day: string
): Promise<DailyMenu> {
  try {
    const response = await fetchData<DailyMenu>(
      apiURL + `/api/v1/restaurants/daily/${restaurantId}/fi?day=${day}`
    );
    console.log(`Daily menu response for ${day}:`, response); // Debug the response
    return response;
  } catch (error) {
    console.error(`Failed to fetch daily menu for ${day}:`, error);
    return {courses: []};
  }
}

// Define interfaces for type safety
interface Restaurant {
  _id: string;
  companyId: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  company: string;
}

interface DailyMenu {
  courses: Course[];
}

interface Course {
  name: string;
  price: string;
  diets?: string;
}
document.addEventListener('DOMContentLoaded', () => {
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  // Teeman vaihtopainikkeen kuuntelija
  const themeToggleBtn = document.getElementById('theme-toggle');
  themeToggleBtn?.addEventListener('click', toggleTheme);

  // Tarkista käyttäjän viimeksi valitsema teema ja aseta oikea ikoni
  const savedTheme = localStorage.getItem('theme');
  const themeIcon = document.getElementById('theme-icon');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeIcon?.classList.replace('fa-sun', 'fa-moon');
  }
});

// Funktio teeman vaihtamiseen
function toggleTheme() {
  const themeIcon = document.getElementById('theme-icon');
  document.body.classList.toggle('dark-theme');

  // Vaihda ikoni teeman mukaan
  if (document.body.classList.contains('dark-theme')) {
    themeIcon?.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'dark'); // Tallenna pimeä teema localStorageen
  } else {
    themeIcon?.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'light'); // Tallenna vaalea teema localStorageen
  }
}
