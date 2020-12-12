
/**
 * Afficher le nom  de l'architecte et récupérer ses détails s'il est disponible
 * @param details l'objet json contenant les détails du monument courant
 */
function loadArchitect(details) {
  let element = "architect";
  if (element in details) {
    $("#infoArchitectContainer").removeClass("d-none");
    let architect = details[element]["value"];
    $("#" + element).text(removeUrl(architect));

    let sparqlRequest = createSparqlRequestForArchitectDetails("<" + architect + ">");
    let baseURLFull = createHTTPRequest(sparqlRequest);

    // Send http request and fetch json result
    fetch(baseURLFull)
      .then((response) => response.json())
      .then((data) => displayArchitect(data))
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    $("#" + element).parent().addClass("d-none");
  }
}

/**
 * Remplir la page html avec les détaills de l'architecte
 * @param jsonResponse l'objet json contenant les détails de l'architecte
 */
function displayArchitect(jsonResponse) {
  // Extract the part containing the details
  let details = jsonResponse.results.bindings[0];

  if (details == undefined) {
    console.error("details are undefined, can't find architect's data");
    return;
  }

  let categories = ["description", "birthDate", "birthPlace", "deathDate", "deathPlace"];
  let categoriesWithMultipleValues = ["nationality", "creatorOf"];
  
  // Categorie
  for (let i = 0; i < categories.length; i++) {
    let element = categories[i];
    if (element in details) {
      let data = details[element]["value"];
      let text = "<li>" + parseString(element) + ": " + data + "</li>";
      $("#detailsArchitect").append(text);
    }
  }

  // Categorie with multiple values
  for (let j = 0; j < categoriesWithMultipleValues.length; j++) {
    let elementMultValues = categoriesWithMultipleValues[j];
    if (elementMultValues in details) {
    	if(details[elementMultValues]["value"].length > 0){
    		$("#detailsArchitect").append("<li>" + parseString(elementMultValues) + ": </li>");
	      	$("#detailsArchitect").append("<ul id=" + elementMultValues + ">");
	      	displayList(details, elementMultValues, elementMultValues);
	      	$("#detailsArchitect").append("</ul>");
    	}
    }
  }
}

/**
 * Insérer une liste dans la page html
 * @param details objet json contenant les détails
 * @param element le nom de la liste à insérer dans le html
 * @idHtml id balise à remplacer dans le fichier result.html
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

/**
 * Retire l'URL de l'URI pour n'avoir que le nom de la ressource
 * @param uri l'uri de départ
 * @returns {string} le nom de la ressource
 */
function removeUrl(uri) {
  let uriSplit = uri.split("/");
  return uriSplit[uriSplit.length - 1].replaceAll("_", " ");
}

function parseString(oldString) {
  let newString = oldString.split(/(?=[A-Z])/).join(" ");
  return newString.charAt(0).toUpperCase() + newString.slice(1);
}