/**
Charger la carte des monuments les plus proches.
Il s'agit des 20 monuments les plus proches dans un rayon de 10km de la ressource.
Cette méthode envoie une requête SPARQL et reçoit une réponse sous format JSON.
Après avoir reçu la réponse, elle change les champs HTML de result.html avec les bonnes valeurs.

@param lat  : latitude du monument courant
@param long : longitude du monument courant
@param name : nom du monument courant à afficher
 */
function loadMap(lat, long, name) {
  $('#mapContainer').html('<span class="spinner-border" role="status" aria-hidden="true"/span>');
  let sparqlRequest = createSparqlRequestForMapDetails(lat, long, name);
  let baseURLFull = createHTTPRequest(sparqlRequest);

  //Envoie une requête HTTP et récupère la réponse qui est sous format JSON
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

/**
Affiche la carte des 20 monuments les plus proches dans un rayon de 10km de la ressource.
Ces monuments apparaît avec des fléches bleues etsont cliquables.
Le monument sélectionné apparaît avec une flèche rouge et on voit son nom.
En cliquant dessus, l'utilisateur est redirigé vers la page de présentation de ce monument.

@param lat        : latitude du monument courant
@param long       : longitude du monument courant
@param name       : nom du monument courant à afficher
@param nearPoints : ensemble des latitudes, longitudes et noms des points proches
*/
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