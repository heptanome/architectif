/*
Charger les détails d'un résultat à partir de son URI
@uri l'URI du résultat demandé
 */
function loadDetails(uri) {
  event.preventDefault();
  let sparqlRequest = createSparqlRequestForDetails(uri);
  let baseURLFull = createHTTPRequest(sparqlRequest);

  // Send http request and fetch json result
  fetch(baseURLFull)
    .then((response) => response.json())
    .then((data) => {
      fillWithDetails(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function loadMapDetails(lat, long, name) {
  let sparqlRequest = createSparqlRequestForMapDetails(lat, long, name);
  let baseURLFull = createHTTPRequest(sparqlRequest);

  // Send http request and fetch json result
  fetch(baseURLFull)
    .then((response) => response.json())
    .then((data) => {
      setMap(lat, long, name, data.results.bindings);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/*
Intégrer les résultats dans la page html
@jsonResponse the json object received as a response
 */
function fillWithDetails(jsonResonse) {
  // Extract the part containing the details
  let details = jsonResonse.results.bindings[0];
  console.log(details);

  let categories = [
    "name",
    "description",
    "nbVisitors",
    "locations",
    "lat",
    "long",
    "architect",
    "buildStart",
    "buildEnd",
  ];
  // Fill html
  // TODO : quand un champ n'a pas de réponse, cacher le conteneur html
  /*$("#name").text(details["name"]["value"]);
    $("#picture").attr("src",details.picture.value);
    $("#description").text(details.description.value);
    $("#homepage").attr("href",details.homepage.value);
    $("#homepage").text(details.homepage.value);
    $("#nbVisitors").text(details.nbVisitors.value);
    $("#locations").text(details.locations.value); //TODO : gérer autrement car
    il peut y en avoir plusieurs
    $("#lat").text(details.lat.value);
    $("#long").text(details.long.value);
    $("#architect").text(details.architect.value);
    $("#buildStart").text(details.buildStart.value);
    $("#buildEnd").text(details.buildEnd.value);*/

  for (i = 0; i < categories.length; i++) {
    displayText(details, categories[i]);
  }

  $("#picture").attr("src", details.picture.value);
  $("#homepage").attr("href", details.homepage.value);
  $("#homepage").text(details.homepage.value);

  loadMapDetails(details.lat.value, details.long.value, details.name.value);
}

function displayText(details, element) {
  if (element in details) {
    let data = details[element]["value"];
    $("#" + element).text(data);
  } else {
    $("#" + element).text("N/A");
  }
}

function displayList(details, element) {
  if (element in details) {
    let data = details[element]["value"];
    if (typeof data == "string") {
      $("#" + element).text(data);
    } else {
      let text = "<ul>";
      for (i = 0; i < data.length; i++) {
        text += "<li>" + data[i] + "</li>";
      }
      text += "</ul>";
      $("#" + element).text(text);
    }
  } else {
    $("#" + element).text("N/A");
  }
}

function setMap(lat, long, name, nearPoints) {
  var map = L.map("map").setView([lat, long], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([lat, long]).addTo(map).bindPopup(name).openPopup();

  nearPoints.map((nearPoint) => {
    const la = nearPoint.latitude.value;
    const lo = nearPoint.longitude.value;
    const na = nearPoint.name.value;
    L.marker([la, lo]).addTo(map).bindPopup(na).openPopup();
  });
}
