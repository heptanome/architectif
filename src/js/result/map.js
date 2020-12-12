/**
 * Charger la carte des monuments les plus proches
 * @param lat la latitude du monument courant
 * @param long la longitude du monument courant
 * @param name le nom du monument courant à afficher
 */
function loadMap(lat, long, name) {
  $('#mapContainer').html('<span class="spinner-border" role="status" aria-hidden="true"/span>');
  let sparqlRequest = createSparqlRequestForMapDetails(lat, long, name);
  let baseURLFull = createHTTPRequest(sparqlRequest);

  // Send http request and fetch json result
  fetch(baseURLFull)
    .then((response) => response.json())
    .then((data) => {
      $('#mapContainer').html('<h4 class="font-weight-normal">Map:</h4><div id="map" style="height: 300px"></div>');
      displayMap(lat, long, name, data.results.bindings);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}


function displayMap(lat, long, name, nearPoints) {
  var redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  var map = L.map("map").setView([lat, long], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([lat, long], { icon: redIcon })
    .addTo(map)
    .bindPopup(name)
    .openPopup();

  nearPoints.map((nearPoint) => {
    let link = nearPoint.struct.value;
    link = link.split("/");
    const la = nearPoint.latitude.value;
    const lo = nearPoint.longitude.value;
    const na = nearPoint.name.value;
    L.marker([la, lo])
      .addTo(map)
      .bindPopup(
        "<a href=./result.html?b=" + link[link.length - 1] + ">" + na + "</a>"
      );
  });
}