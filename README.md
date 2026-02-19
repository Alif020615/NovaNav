NovaNav - Smart Navigation & Traffic App

NovaNav is a high-performance, Waze-inspired web navigation application. It features real-time routing, simulated traffic congestion logic, a live traffic news feed, and a gamified community reporting system. Designed with a modern "Glassmorphism" aesthetic, it provides a slick, dark-mode experience for urban navigation.

🚀 Features

Real-Time Routing: Calculates precise travel time and distance using OSRM and Leaflet Routing Machine.

Live Geocoding: Search for any real-world address or landmark using the Nominatim OpenStreetMap API.

Traffic Simulation: Visualizes traffic congestion segments and updates ETA logic accordingly.

Community Reporting (XP System): Users earn XP by reporting Police, Hazards, Crashes, or Traffic Jams.

Live News Ticker: A scrolling feed of simulated local traffic updates and weather alerts.

Navigation Mode: A focused turn-by-turn UI state that activates when starting a trip.

Responsive Glass UI: A modern, dark-themed interface that adapts to mobile and desktop screens.

🛠️ Tech Stack

Frontend: HTML5, CSS3 (Glassmorphism), JavaScript (ES6+).

Mapping Engine: Leaflet.js with Dark Mode CartoDB tiles.

Routing: Leaflet Routing Machine.

Geocoding: Nominatim API.

Icons: FontAwesome 6.

📂 Project Structure

/NovaNav
├── index.html      # Main structure and CSS styles
├── script.js       # Map logic, routing, and search functionality
└── README.md       # Project documentation


⚙️ Setup & Installation

Download the files: Ensure index.html and script.js are in the same folder.

Open index.html: You can double-click the file to open it in any modern web browser.

Grant Location Access: For the best experience, allow the browser to access your location to center the map on your position.

VS Code Live Server: Recommended for development to avoid CORS issues with local file fetching (though not strictly necessary for this build).

🎮 How to Use

Search: Use the top bar to search for a destination (e.g., "Central Park", "Eiffel Tower").

Navigate: Click "Start Navigation" to lock the camera and see turn-by-turn instructions.

Report: Click the Bullhorn Icon to report road incidents.

Jam: Heavy traffic.

Police: Speed traps or presence.

Hazard: Debris or danger.

XP: Watch your XP score grow with every contribution!

📝 License

Free to use for personal and educational purposes.
