/**
Afficher l'emplacement du monument et sa présentation.
Si aucun emplacement est renseigné sur la page DBPedia du monument, aucun champs
n'est affiché dans le fichier result.html.

@param details : l'objet json contenant les détails du monument courant
 */
function loadLocation(details) {
	let element = "locations"
	if (element in details) {
		let data = details[element]["value"];
	  	let dataSplitted = data.split(" ");
	  	let text = "";
	  	if(dataSplitted[0] == "") {
	    	$("#" + element).parent().addClass("d-none");
		} else {
	    	for (let i = 0; i < dataSplitted.length; i++) {
	      		let locationName = dataSplitted[i].replaceAll("_", " ");
	      		displayLocation(locationName, element);
	    	}
	  	}
  	} else {
		$("#"+element).parent().addClass("d-none");
  	}
}

/**
Afficher l'emplacement du monument et sa présentation.
Si aucun emplacement est renseigné sur la page DBPedia du monument, aucun champs
n'est affiché dans le fichier result.html.
Cette méthode envoie une requête SPARQL et reçoit une réponse sous format JSON.
Après avoir reçu la réponse, elle change les champs HTML de result.html avec les bonnes valeurs.

@param locationName : emplacement du monument
@param idHTML       : id de la balise HTML servant à afficher la localisation
 */
function displayLocation(locationName,idHtml){
  let sparqlRequest = createSparqlRequestForLocation(locationName);
  let baseURLFull = createHTTPRequest(sparqlRequest);
  
  //Envoie une requête HTTP et récupère la réponse qui est sous format JSON
  fetch(baseURLFull)
      .then((response) => response.json())
      .then((data) => {
        let text="";
        if(data.results.bindings.length !=0){
          let abstract = data.results.bindings[0].abs.value;
            text += "<li><a data-toggle=\"collapse\" href=\"#collapse"
            		+locationName
            		+"\" aria-expanded=\"false\" aria-controls=\"collapse"
            		+locationName
            		+"\">"
            		+locationName
            		+"</a></li>\n<div  class=\"collapse\" id=\"collapse"
            		+locationName
            		+"\">\n<div id=\"collapse-body-"
            		+locationName
            		+"\" class=\"card card-body\">"
            		+abstract
            		+"</div>\n</div>";
        }else if(locationName !=""){
          text += "<li>"+locationName+"</li>\n";
        }

        $("#" + idHtml).append(text);

      })
      .catch((error) => {
        console.error("Error:", error);
      });
}