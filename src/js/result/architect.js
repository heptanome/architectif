/**
Afficher le nom  de l'architecte et récupérer ses détails.
Si aucun architecte est renseigné sur la page DBPedia du monument, aucun champs
n'est affiché dans le fichier result.html.
Cette méthode envoie une requête SPARQL et reçoit une réponse sous format JSON.
Après avoir reçu la réponse, elle change les champs HTML de result.html avec les bonnes valeurs.

@param details : l'objet json contenant les détails du monument courant
 */
function loadArchitect(details) {
  let element = "architect";
  if (element in details) {
  console.log(details);
    let architect = details[element]["value"];
    $("#" + element).text(removeUrl(architect));

    let sparqlRequest = createSparqlRequestForArchitectDetails("<" + architect + ">");
    let baseURLFull = createHTTPRequest(sparqlRequest);

    //Envoie une requête HTTP et récupère la réponse qui est sous format JSON
    fetch(baseURLFull)
      .then((response) => response.json())
      .then((data) => {
      	let details = data.results.bindings[0];
      	if(details != undefined){
      		displayArchitect(details)
      	}
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    $("#" + element).parent().addClass("d-none");
  }
}

/**
Remplir la page html avec les détails de l'architecte.
Parmi ces détails se trouvent la date et le lieu de naissance et de mort 
de l'architecte ainsi qu'une description, la liste de ses nationalités
et une liste des oeuvres qu'il a réalisé. Seule la description est une forcément
présente dans la réponse JSON. Si un champs n'est pas renseigné, il n'est pas affiché.

@param details : l'objet json contenant les détails de l'architecte
 */
function displayArchitect(details) {
  let categories = ["description", "birthDate", "birthPlace", "deathDate", "deathPlace"];
  let categoriesWithMultipleValues = ["nationality", "creatorOf"];
  
  // Champs qui contiennent une unique réponse
  for (let i = 0; i < categories.length; i++) {
    let element = categories[i];
    if (element in details) {
      let data = details[element]["value"];
      let text = "<li>" + parseString(element) + ": " + data + "</li>";
      $("#detailsArchitect").append(text);
    }
  }

  // Champs qui contiennent plusieurs réponses concaténées par des espaces
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
Insérer une liste dans la page html.

@param details : objet json contenant les détails
@param element : le nom de la liste à insérer dans le html
@param idHtml  : id balise à remplacer dans le fichier result.html
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
Retirer l'URL de l'URI pour n'avoir que le nom de la ressource.
Les caractères "_"de l'URL sont remplacés par des espaces.

@param uri : l'uri de départ
@return    : le nom de la ressource
 */
function removeUrl(uri) {
  let uriSplit = uri.split("/");
  return uriSplit[uriSplit.length - 1].replaceAll("_", " ");
}

/**
Ajouter des espaces avant chaque majuscule d'un string et
Mettre la première lettre en majuscule.

@param oldString : le string à transformer
@return          : le string avec les transformations réalisées
 */
function parseString(oldString) {
  let newString = oldString.split(/(?=[A-Z])/).join(" ");
  return newString.charAt(0).toUpperCase() + newString.slice(1);
}