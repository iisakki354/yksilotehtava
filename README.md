Restaurant List Application - README
# Restaurant List Application
This is a Progressive Web Application (PWA) built with Vite and TypeScript, designed to display a
list of Finnish student restaurants. Users can view daily or weekly menus, locate restaurants on a
map using Leaflet, and manage user authentication.
## Features
- Restaurant List: View a list of restaurants, including details like name, company, and address.
- Search Functionality: Filter restaurants based on name, company, or address.
- Daily and Weekly Menus: Toggle between viewing daily or weekly menus for the selected
restaurant.
- Map Integration: Display restaurant locations on a map using Leaflet and OpenStreetMap.
- Dark Mode Toggle: Users can switch between light and dark themes, with their preference stored
in localStorage.
- User Authentication: Basic sign-up and login functionality with JWT tokens.
- Responsive Design: The application is designed to work on both desktop and mobile devices.
## Technology Stack
- Frontend:
 - TypeScript
 - HTML5
 - CSS3
 - Leaflet.js for map integration
 - Vite for development and build
- Backend (External API):
 - Data fetched from Metropolia's Restaurant API
## Installation
To run the project locally:
1. Clone the repository:
 ``git clone https://github.com/Azzni96/ResturantList.git``
2. Navigate to the project directory:
 ``cd ResturantList``
3. Install dependencies:
`` npm install``
4. Install Vite PWA:
`` npm install -D vite-plugin-pwa``
5. Install Leaflet for maps:
 ``npm install leaflet``
6. Run the development server:
 ``npm run dev``
 The app will be available at http://localhost:3000.
7. Build the project for production:
 ``npm run build``
 The production-ready files will be in the dist/ directory.

## PWA Configuration
This project is a fully functional Progressive Web Application (PWA). It can be installed on devices,
and it includes:
- Offline support: Uses service workers to cache necessary assets, allowing offline access.
- Auto updates: Automatically updates when new versions are available.
- App manifest: Configures the app name, icons, and theme for installation.

## API Endpoints
The app interacts with the following API endpoints:
- GET /api/v1/restaurants: Fetches the list of restaurants.
- GET /api/v1/restaurants/daily/{id}/fi: Fetches the daily menu of a specific restaurant.
- GET /api/v1/restaurants/weekly/{id}/fi: Fetches the weekly menu of a specific restaurant.

## Usage
- Sign Up / Log In: Users can sign up or log in to the application. After logging in, the session is
stored using JWT tokens.
- Search: Use the search bar to find restaurants by name, company, or address.
- View Menus: After clicking on a restaurant, a modal will display the daily menu by default. Use the
toggle buttons to switch to the weekly menu.
- Theme Switching: Toggle between light and dark themes using the sun/moon icon at the top of the
page.

## File Structure
src/
 components.ts # UI components like restaurant rows and modals
 Fetchdata.ts # Handles API requests
 sginapi.ts # Signup and login functionality
 RavintolaLista.ts # Core logic for loading restaurants, map, and menus
 variables.ts # API URL and constants
public/
 main.css # Styling for the application
index.html # Main entry point of the application

## How to Contribute
Contributions are welcome! If you find a bug or want to suggest improvements, feel free to open an
issue or submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
If you have any questions, feel free to reach out via email or check the project on GitHub.
# yksilotehtava
