/*
Charger les détails d'un résultat à partir de son URI
@uri l'URI du résultat demandé
 */
function loadDetails(){
	let uri = "<"+findParameters()[0]+">";
    event.preventDefault();
    let sparqlRequest = createSparqlRequestForDetails(uri);
    let baseURLFull = createHTTPRequest(sparqlRequest);

    //Send http request and fetch json result
    fetch(baseURLFull)
        .then(response => response.json())
        .then(data => fillWithDetails(data))
        .catch(error => {
            console.error('Error:', error);
        });

}

/*
Intégrer les résultats dans la page html
@jsonResponse the json object received as a response
 */
function fillWithDetails(jsonResonse){
    console.log(jsonResonse);
    //Extract the part containing the details
    let details = jsonResonse.results.bindings[0];
    console.log(details);

	let categories = ["name", "description", "nbVisitors", "lat", "long", "buildStart", "buildEnd"]
    //Fill html
    for (let i = 0; i < categories.length; i++) {
  		displayText(details, categories[i]);
	}
	if ("locations" in details){
		displayList(details, "locations", "locations");
	} else {
		$("#locations").parent().addClass("d-none");
	}
	
	if(details.picture){
		$("#picture").attr("src",details.picture.value);
	} else {
		$("#picture").parent().addClass("d-none");
	}
	
	if(details.homepage){
		$("#homepage").attr("href",details.homepage.value);
    	$("#homepage").text(details.homepage.value);
	} else {
		$("#homepage").parent().addClass("d-none");
	}
	displayArchitect(details);
}


function displayText(details, element){

    if (element in details){
    	let data = details[element]["value"];
		$("#" + element).text(data);
    } else {
    	$("#" + element).parent().addClass("d-none");
    }
}

function displayList(details, element, idHtml){
    let data = details[element]["value"];
	let dataSplitted = data.split(" ");
	let text = "";
	for (let i = 0; i < dataSplitted.length; i++) {
    	let locationName = removeUrl(dataSplitted[i]);
		text += "<li>" + locationName + "</li>";
	}
	$("#" + idHtml).append(text);
}

function displayArchitect(details){
	let element = "architect";
	if (element in details){
		$("#infoArchitectContainer").removeClass("d-none");
    	let architect = details[element]["value"];
		$("#" + element).text(removeUrl(architect));
		
		let sparqlRequest = createSparqlRequestForArchitectDetails("<"+architect+">");
   		let baseURLFull = createHTTPRequest(sparqlRequest);

    	//Send http request and fetch json result
    	fetch(baseURLFull)
	        .then(response => response.json())
	        .then(data => fillWithArchitectDetails(data))
	        .catch(error => {
	            console.error('Error:', error);
	        });
		
    } else {
    	$("#" + element).parent().addClass("d-none");
    }
}

function fillWithArchitectDetails(jsonResonse){
    console.log(jsonResonse);
    //Extract the part containing the details
    let details = jsonResonse.results.bindings[0];
    console.log(details);

	let categories = ["description", "birthDate", "deathDate"];
	let categoriesWithMultipleValues = ["nationalities", "birthPlaces", "deathPlaces", "buildings"];
    //Categorie
    for (let i = 0; i < categories.length; i++) {
    	let element = categories[i];
    	if(element in details) {
  			let data = details[element]["value"];
			let dataWithoutUrl = removeUrl(data);
			let text = "<li>"+ element+" : "+ dataWithoutUrl + "</li>";
			$("#detailsArchitect").append(text);
  		}
	}

	//Categorie with multiple values
	for (let j = 0; j< categoriesWithMultipleValues.length; j++){
		let elementMultValues = categoriesWithMultipleValues[j];
		if (elementMultValues in details){
			$("#detailsArchitect").append("<li>"+ elementMultValues + "</li>");
			$("#detailsArchitect").append("<ul id="+ elementMultValues +">");
			displayList(details, elementMultValues, elementMultValues);
			$("#detailsArchitect").append("</ul>");
		}
	}

}

function findParameters(){
	let $_GET = [];
	let parts = window.location.search.substr(1).split("&");
	for (let i = 0; i < parts.length; i++) {
	    let temp = parts[i].split("=");
	    $_GET[i] = temp[1];
	}
	return $_GET;
}

function removeUrl(uri){
	let uriSplit = uri.split("/")
	return uriSplit[uriSplit.length-1].replaceAll("_", " ");;
}
