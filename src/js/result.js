/**
Charger les détails d'un résultat à partir de son URI
@uri l'URI du résultat demandé
 */
function loadDetails(uri) {
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

/**
 * Charger la carte des monuments les plus proches
 * @param lat la latitude du monument courant
 * @param long la longitude du monument courant
 * @param name le nom du monument courant à afficher
 */
function loadMapDetails(lat, long, name) {
  $('#mapContainer').html('<span class="spinner-border" role="status" aria-hidden="true"/span>');
  let sparqlRequest = createSparqlRequestForMapDetails(lat, long, name);
  let baseURLFull = createHTTPRequest(sparqlRequest);

  // Send http request and fetch json result
  fetch(baseURLFull)
    .then((response) => response.json())
    .then((data) => {
      $('#mapContainer').html('<h4 class="font-weight-normal">Map:</h4><div id="map" style="height: 300px"></div>');
      setMap(lat, long, name, data.results.bindings);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function locationRequest(locationName,locationId,idHtml,baseURLFull){
  // Send http request and fetch json result
  fetch(baseURLFull)
      .then((response) => response.json())
      .then((data) => {
        let text="";

        if(data.results.bindings.length !=0){
          let abstract = data.results.bindings[0].abs.value;
            text += "<li><a data-toggle=\"collapse\" href=\"#collapse"+locationId+"\" aria-expanded=\"false\" aria-controls=\"collapse"+locationId+"\">"+locationName+"</a></li>\n";
            text +=  "<div  class=\"collapse\" id=\"collapse"+locationId+"\">\n" + "<div id=\"collapse-body-"+locationId +"\" class=\"card card-body\">"+abstract+"</div>\n" + "</div>";
        }else if(locationName !=""){
          text += "<li>"+locationName+"</li>\n";
        }

        $("#" + idHtml).append(text);

      })
      .catch((error) => {
        console.error("Error:", error);
      });
}

/**
Intégrer les résultats dans la page html
@jsonResponse the json object received as a response
 */
function fillWithDetails(jsonResponse) {
  // Extract the part containing the details
  let details = jsonResponse.results.bindings[0];

  let categories = [
    "name",
    "description",
    "nbVisitors",
    "lat",
    "long",
    "buildStart",
    "buildEnd",
  ];

  // Fill html
  for (let i = 0; i < categories.length; i++) {
    displayText(details, categories[i]);
  }
  if(!details.buildStart && !details.buildEnd){
    $("#constructionContainer").addClass("d-none");
  }

  if ("locations" in details) {
    displayListWithCollapse(details, "locations", "locations");
  } else {
    $("#locations").parent().addClass("d-none");
  }

  if (details.picture) {
    $("#picture").attr("src", details.picture.value);
  } else {
    $("#picture").parent().addClass("d-none");
  }

  if (details.homepage) {
    $("#homepage").attr("href", details.homepage.value);
    $("#homepage").text(details.homepage.value);
  } else {
    $("#homepage").parent().addClass("d-none");
  }

  if(details.lat && details.long && details.name){
    loadMapDetails(details.lat.value, details.long.value, details.name.value);
  } else {
    $("#map").parent().addClass("d-none");
  }

  displayArchitect(details);
}

/**
 * Insérer un élément textuel dans la page html
 * @param details objet json contenant les détails
 * @param element le nom de l'élément à insérer dans le html
 */
function displayText(details, element) {
  if (element in details) {
    let data = details[element]["value"];
    $("#" + element).text(data);
  } else {
    $("#" + element).parent().addClass("d-none");
  }
}

/**
 * Insérer une liste dans la page html
 * @param details objet json contenant les détails
 * @param element le nom de la liste à insérer dans le html
 */
function displayList(details, element) {
  if (element in details) {
    let data = details[element]["value"];
    if (typeof data == "string") {
      $("#" + element).text(data);
    } else {
      let text = "<ul>";
      for (let i = 0; i < data.length; i++) {
        text += "<li>" + data[i] + "</li>";
      }
      text += "</ul>";
      $("#" + element).text(text);
    }
  } else {
    $("#" + element).parent().addClass("d-none");
  }
}

/**
 * Insérer une liste dans la page html
 * @param details objet json contenant les détails
 * @param element le nom de la liste à insérer dans le html
 */
function displayList(details, element, idHtml) {
  let data = details[element]["value"];
  let dataSplitted = data.split(" ");
  let text = "";
  for (let i = 0; i < dataSplitted.length; i++) {
    let locationName = removeUrl(dataSplitted[i]);
    text += "<li>" + locationName + "</li>";
  }
  $("#" + idHtml).append(text);
}

function displayListWithCollapse(details, element, idHtml) {
  let data = details[element]["value"];
  let dataSplitted = data.split(" ");
  let text = "";
  if(dataSplitted[0] == "") {
    $("#" + idHtml).parent().addClass("d-none");
  } else {
    for (let i = 0; i < dataSplitted.length; i++) {
      let locationName = removeUrl(dataSplitted[i]);
      let locationId = locationName.replace(/ /g, "");

      let sparqlRequest = createSparqlRequestForLocation(locationName);
      let baseURLFull = createHTTPRequest(sparqlRequest);
      locationRequest(locationName, locationId, idHtml, baseURLFull);
    }
  }
}

function setMap(lat, long, name, nearPoints) {
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

/**
 * Afficher le nom  de l'architecte et récupérer ses détails s'il est disponible
 * @param details l'objet json contenant les détails du monument courant
 */
function displayArchitect(details) {
  let element = "architect";
  if (element in details) {
    $("#infoArchitectContainer").removeClass("d-none");
    let architect = details[element]["value"];
    $("#" + element).text(removeUrl(architect));

    let sparqlRequest = createSparqlRequestForArchitectDetails(
      "<" + architect + ">"
    );
    let baseURLFull = createHTTPRequest(sparqlRequest);

    // Send http request and fetch json result
    fetch(baseURLFull)
      .then((response) => response.json())
      .then((data) => fillWithArchitectDetails(data))
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    $("#" + element)
      .parent()
      .addClass("d-none");
  }
}

/**
 * Remplir la page html avec les détaills de l'architecte
 * @param jsonResponse l'objet json contenant les détails de l'architecte
 */
function fillWithArchitectDetails(jsonResponse) {
  console.log(jsonResponse);
  // Extract the part containing the details
  let details = jsonResponse.results.bindings[0];

  if (details == undefined) {
    console.error("details are undefined, can't find architect's data");
    return;
  }

  let categories = ["description", "birthDate", "deathDate"];
  let categoriesWithMultipleValues = [
    "nationalities",
    "birthPlaces",
    "deathPlaces",
    "buildings",
  ];
  // Categorie
  for (let i = 0; i < categories.length; i++) {
    let element = categories[i];
    if (element in details) {
      let data = details[element]["value"];
      let dataWithoutUrl = removeUrl(data);
      let text = "<li>" + parseString(element) + ": " + dataWithoutUrl + "</li>";
      $("#detailsArchitect").append(text);
    }
  }

  // Categorie with multiple values
  for (let j = 0; j < categoriesWithMultipleValues.length; j++) {
    let elementMultValues = categoriesWithMultipleValues[j];
    if (elementMultValues in details) {
    	if(details[elementMultValues]["value"].length > 0){
    		$("#detailsArchitect").append("<li>" + parseString(elementMultValues) + "</li>");
	      	$("#detailsArchitect").append("<ul id=" + elementMultValues + ">");
	      	displayList(details, elementMultValues, elementMultValues);
	      	$("#detailsArchitect").append("</ul>");
    	}
    }
  }
}

function parseString(oldString) {
  let newString = oldString.split(/(?=[A-Z])/).join(" ");
  return newString.charAt(0).toUpperCase() + newString.slice(1);

}

/**
 * Retire l'URL de l'URI pour n'avoir que le nom de la ressource
 * @param uri l'uri de départ
 * @returns {string} le nom de la ressource
 */
function removeUrl(uri) {
  let uriSplit = uri.split("/");
  return uriSplit[uriSplit.length - 1].replaceAll("_", " ");
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const building = urlParams.get("b");
console.log(building);
loadDetails(`<http://dbpedia.org/resource/${building}>`);
