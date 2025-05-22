$(document).ready(function () {
    // Load header
    $("#header").load("header.html", function () {
      $.getScript("js/header.js");
    });
  
    $("#footer").load("footer.html");
    $("#header").css("background", "none");
  });


// Initialize the map
var map = L.map("map").setView([20.5937, 78.9629], 5);

// Base Layers
var streets = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "&copy; OpenStreetMap contributors",
  }
).addTo(map);

var terrain = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    attribution: "&copy; OpenTopoMap contributors",
  }
);

var googleSatellite = L.tileLayer(
  "https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
  {
    attribution: "&copy; Google",
  }
);

// GeoServer Layers
var indiaBorder = L.tileLayer.wms(
  "http://localhost:8081/geoserver/lbjf/wms",
  {
    layers: "lbjf:india_bdr",
    format: "image/png",
    transparent: true,
  }
);

var stateBorder = L.tileLayer.wms(
  "http://localhost:8081/geoserver/lbjf/wms",
  {
    layers: "lbjf:state_bdr",
    format: "image/png",
    transparent: true,
  }
);

var districtBorder = L.tileLayer.wms(
  "http://localhost:8081/geoserver/lbjf/wms",
  {
    layers: "lbjf:dist_bdr",
    format: "image/png",
    transparent: true,
  }
);

// Layer Control
var baseMaps = {
  Streets: streets,
  Terrain: terrain,
  "Google Satellite": googleSatellite,
};

var overlayMaps = {
  "India Border": indiaBorder,
  "State Border": stateBorder,
  "District Border": districtBorder,
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

// Scale Bar
L.control.scale({ position: "bottomleft" }).addTo(map);

// Cursor Lat/Lon Display
var cursorCoords = document.getElementById("cursor-coords");

map.on("mousemove", function (e) {
  let lat = e.latlng.lat.toFixed(4);
  let lng = e.latlng.lng.toFixed(4);
  cursorCoords.innerHTML = `Lat: ${lat}, Lng: ${lng}`;
});

// Search Box
document
  .getElementById("search-box")
  .addEventListener("input", function () {
    let query = this.value.trim();
    if (query.length < 3) return;

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    )
      .then((response) => response.json())
      .then((data) => {
        let dropdown = document.getElementById("search-results");
        dropdown.innerHTML = "";
        dropdown.style.display = "block";

        data.slice(0, 5).forEach((location) => {
          let item = document.createElement("div");
          item.className = "search-item";
          item.innerHTML = location.display_name;
          item.onclick = function () {
            map.setView([location.lat, location.lon], 10);
            dropdown.style.display = "none";
          };
          dropdown.appendChild(item);
        });
      })
      .catch((error) =>
        console.error("Error fetching search results:", error)
      );
  });

// Hide search dropdown when clicking outside
document.addEventListener("click", function (event) {
  if (!event.target.closest("#search-container")) {
    document.getElementById("search-results").style.display = "none";
  }
});
let locationMarkers = [];

document
  .getElementById("toggleLocations")
  .addEventListener("change", function () {
    if (this.checked) {
      fetchLocations();
    } else {
      clearMarkers();
    }
  });

function fetchLocations() {
  fetch("http://127.0.0.1:5000/locationsss")
    .then((response) => response.json())
    .then((locations) => {
      locations.forEach((loc) => {
        let marker = L.marker([loc.latitude, loc.longitude], { className: "animated-marker" }).addTo(map);
        marker.bindPopup(`<div class='popup-content'><b>${loc.location_name}</b><br>
              <button class='btn btn-primary btn-sm' onclick="fetchJobs(${loc.location_id}, ${loc.latitude}, ${loc.longitude})">View Jobs</button></div>`);
        locationMarkers.push(marker);
      });
    })
    .catch((error) => console.error("Error fetching locations:", error));
}

function clearMarkers() {
  locationMarkers.forEach((marker) => map.removeLayer(marker));
  locationMarkers = [];
}

function fetchJobs(location_id, lat, lng) {
  fetch(`http://127.0.0.1:5000/jobsss/${location_id}`)
    .then((response) => response.json())
    .then((jobs) => {
      let jobList = "<b>Jobs Available:</b><ul class='list-group'>";
      jobs.forEach((job) => {
        jobList += `<li class='list-group-item'><a href="#" class='text-primary anch' onclick="fetchJobDetails(${job.job_id})">${job.title}</a></li>`;
      });
      jobList += "</ul>";
      L.popup({ className: "popup-content" }).setLatLng([lat, lng]).setContent(jobList).openOn(map);
    });
}

function fetchJobDetails(job_id) {
      fetch(`http://127.0.0.1:5000/job_detailsss/${job_id}`)
          .then((response) => response.json())
          .then((job) => {
              if (job.error) {
                  alert("Job not found");
                  return;
              }
              document.getElementById("modallContentt").innerHTML = `
                  <b>${job.title}</b><br>
                  ${job.description}<br>
                  <b>Requirements:</b> ${job.requirements}<br>
                  <b>Salary:</b> ${job.monthly_income || "N/A"}<br>
                  <b>Agency:</b> ${job.agency_name}<br>
                  <b>Category:</b> ${job.category_name}
              `;
              document.getElementById("jobModall").classList.add("show");
          });
  }
  function closeModall() {
      document.getElementById("jobModall").classList.remove("show");
  }