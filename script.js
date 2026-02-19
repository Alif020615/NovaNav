let map, routingControl, userMarker, destinationMarker;
let xp = 0;
let navigationStarted = false;
let currentPos = [3.0249, 101.7011]; // Default: Seri Kembangan

function init() {
    // 1. Initialize Map
    map = L.map('map', { zoomControl: false, attributionControl: false }).setView(currentPos, 13);

    // 2. Add Dark Theme Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

    // 3. User Icon
    const userIcon = L.divIcon({
        html: `<div style="width: 20px; height: 20px; background: #00e0ff; border: 4px solid #fff; border-radius: 50%; box-shadow: 0 0 15px #00e0ff;"></div>`,
        className: '',
        iconSize: [20, 20]
    });
    userMarker = L.marker(currentPos, { icon: userIcon }).addTo(map);

    // 4. Request Real Location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            currentPos = [pos.coords.latitude, pos.coords.longitude];
            map.setView(currentPos, 15);
            userMarker.setLatLng(currentPos);
        }, () => {
            console.log("Location access denied or unavailable.");
        });
    }

    setupSearch();
    generateTrafficNews();
}

// --- SEARCH ENGINE (Nominatim API) ---
function setupSearch() {
    const input = document.getElementById('search-input');
    const resultsDiv = document.getElementById('search-results');
    const spinner = document.getElementById('loading-spinner');
    let timeout = null;

    input.oninput = (e) => {
        clearTimeout(timeout);
        const query = e.target.value;
        if (query.length < 3) {
            resultsDiv.style.display = 'none';
            return;
        }

        timeout = setTimeout(async () => {
            spinner.style.display = 'block';
            try {
                // Fetch real locations from OpenStreetMap
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
                const data = await response.json();
                displayResults(data);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                spinner.style.display = 'none';
            }
        }, 500);
    };
}

function displayResults(data) {
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = '';
    
    if (data.length === 0) {
        resultsDiv.style.display = 'none';
        return;
    }

    data.forEach(place => {
        const item = document.createElement('div');
        item.className = 'result-item';
        const mainName = place.display_name.split(',')[0];
        const secondary = place.display_name.split(',').slice(1).join(',').trim();
        
        item.innerHTML = `
            <div class="title">${mainName}</div>
            <div class="subtitle">${secondary}</div>
        `;
        item.onclick = () => selectDestination(place.lat, place.lon, mainName);
        resultsDiv.appendChild(item);
    });
    resultsDiv.style.display = 'block';
}

function selectDestination(lat, lon, name) {
    const dest = [parseFloat(lat), parseFloat(lon)];
    document.getElementById('search-results').style.display = 'none';
    document.getElementById('search-input').value = name;

    if (destinationMarker) map.removeLayer(destinationMarker);
    destinationMarker = L.marker(dest).addTo(map).bindPopup(name).openPopup();
    
    updateRoute(dest);
    map.flyTo(dest, 14);
    
    document.getElementById('start-btn').disabled = false;
    document.getElementById('start-btn').innerText = "START NAVIGATION";
}

// --- ROUTING ENGINE ---
function updateRoute(dest) {
    if (routingControl) map.removeControl(routingControl);

    routingControl = L.Routing.control({
        waypoints: [L.latLng(currentPos), L.latLng(dest)],
        lineOptions: { styles: [{ color: '#00e0ff', weight: 8, opacity: 0.8 }] },
        createMarker: () => null
    }).addTo(map);

    routingControl.on('routesfound', (e) => {
        const route = e.routes[0];
        updateStats(route);
        addNewsItem("ROUTE", "Faster route found via community data.", "success");
    });
}

function updateStats(route) {
    const timeSec = route.summary.totalTime;
    const distM = route.summary.totalDistance;
    const min = Math.round(timeSec / 60);
    const miles = (distM / 1609.34).toFixed(1);
    
    document.getElementById('duration-text').innerText = `${min} min`;
    document.getElementById('dist-text').innerText = `${miles} mi`;
    document.getElementById('next-dist-text').innerText = `Destination in ${miles} miles`;

    const arrival = new Date();
    arrival.setSeconds(arrival.getSeconds() + timeSec);
    document.getElementById('eta-text').innerText = arrival.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// --- COMMUNITY FEATURES ---
function generateTrafficNews() {
    const news = [
        { tag: "LIVE", text: "Welcome to NovaNav. Community active.", type: "success" },
        { tag: "POLICE", text: "Police reported on major junction.", type: "warning" }
    ];
    news.forEach(n => addNewsItem(n.tag, n.text, n.type));
}

function addNewsItem(tag, text, type) {
    const container = document.getElementById('news-feed');
    const colorMap = { danger: '#ff4757', warning: '#ffa502', success: '#2ed573' };
    const item = document.createElement('div');
    item.className = 'news-item';
    item.innerHTML = `
        <span class="news-tag" style="background: ${colorMap[type]}">${tag}</span>
        <span>${text}</span>
    `;
    container.prepend(item);
}

window.sendReport = function(type, color, icon) {
    xp += 15;
    document.getElementById('xp-count').innerText = xp;
    toggleReportGrid(false);
    addNewsItem("REPORT", `You reported ${type.toLowerCase()}. Thank you!`, "success");
    L.circle(map.getCenter(), {radius: 100, color: color}).addTo(map);
}

// --- UI EVENT LISTENERS ---
const reportTrigger = document.getElementById('report-trigger');
const reportGrid = document.getElementById('report-grid');
const tripStats = document.getElementById('trip-stats');
const startBtn = document.getElementById('start-btn');

function toggleReportGrid(show) {
    tripStats.style.display = show ? 'none' : 'block';
    reportGrid.style.display = show ? 'grid' : 'none';
    reportTrigger.style.transform = show ? 'rotate(45deg)' : 'rotate(0deg)';
}

reportTrigger.onclick = () => toggleReportGrid(reportGrid.style.display !== 'grid');
document.getElementById('close-reports').onclick = () => toggleReportGrid(false);

startBtn.onclick = () => {
    navigationStarted = !navigationStarted;
    if (navigationStarted) {
        startBtn.innerText = "END NAVIGATION";
        startBtn.style.background = "#ff4757";
        document.getElementById('top-ui').parentElement.style.display = 'none';
        document.getElementById('nav-banner').style.display = 'flex';
        map.setZoom(17);
        map.panTo(currentPos);
    } else {
        location.reload();
    }
};

window.onload = init;