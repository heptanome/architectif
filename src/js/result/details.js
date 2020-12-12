
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const building = urlParams.get("b");
loadDetails(`<http://dbpedia.org/resource/${building}>`);


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
      displayDetails(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/**
Intégrer les résultats dans la page html
@jsonResponse the json object received as a response
 */
function displayDetails(jsonResponse) {
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
		insertText(details, categories[i]);
	}

	loadArchitect(details);

	if(!details.buildStart && !details.buildEnd){
		$("#constructionContainer").addClass("d-none");
	}

 	if ("locations" in details) {
		displayLocation(details, "locations", "locations");
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
    	loadMap(details.lat.value, details.long.value, details.name.value);
  	} else {
		$("#map").parent().addClass("d-none");
	}
}

/**
 * Insérer un élément textuel dans la page html
 * @param details objet json contenant les détails
 * @param element le nom de l'élément à insérer dans le html
 */
function insertText(details, element) {
  if (element in details) {
    let data = details[element]["value"];
    $("#" + element).text(data);
  } else {
    $("#" + element).parent().addClass("d-none");
  }
}