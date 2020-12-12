/**
Récupérer l'url du monument passé en paramètre du fichier result.Html
Et charger les détails de ce monument.
*/
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const building = urlParams.get("b");
loadDetails(`<http://dbpedia.org/resource/${building}>`);


/**
Charger les détails d'un résultat à partir de son URI.
Cette méthode envoie une requête SPARQL et reçoit une réponse sous format JSON.
Après avoir reçu la réponse, elle change les champs HTML de result.html avec
les bonnes valeurs.

@param uri : l'URI du résultat demandé
 */
function loadDetails(uri) {
  let sparqlRequest = createSparqlRequestForDetails(uri);
  let baseURLFull = createHTTPRequest(sparqlRequest);

  //Envoie une requête HTTP et récupère la réponse qui est sous format JSON
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
Intégrer les résultats dans la page html.

@param jsonResponse : l'objet JSON reçu entant que réponse
 */
function displayDetails(jsonResponse) {
  	// Extracte la partie contenant les détails
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

	//Insère les informations dans les bons champs HTML
	for (let i = 0; i < categories.length; i++) {
		insertText(details, categories[i]);
	}

	//Affiche les informations sur l'architecte (cf architect.js)
	loadArchitect(details);
	//Affiche les informations sur la localisation du monument (cf location.js)
	loadLocation(details);
	
	//Affiche une carte pour voir les monuments proches (cf map.js)
	if(details.lat && details.long && details.name){
    	loadMap(details.lat.value, details.long.value, details.name.value);
  	} else {
		$("#map").parent().addClass("d-none");
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
	
	//Cache les sections si elles sont vides
	if(!details.buildStart && !details.buildEnd){
		$("#constructionContainer").addClass("d-none");
	}
	
	if(!details.lat && !details.long && details.locations.value.length == 0){
		$("#locationAndCoordinatesContainer").addClass("d-none");
	}
}

/**
Insérer un élément textuel dans la page html.

@param details : objet json contenant les détails
@param element : le nom de l'élément à insérer dans le html
 */
function insertText(details, element) {
  if (element in details) {
    let data = details[element]["value"];
    $("#" + element).text(data);
  } else {
    $("#" + element).parent().addClass("d-none");
  }
}