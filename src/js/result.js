/*
Charger les détails d'un résultat à partir de son URI
@uri l'URI du résultat demandé
 */
function loadDetails(uri){
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

	let categories = ["name", "description", "nbVisitors", "lat", "long", "architect", "buildStart", "buildEnd"]
    //Fill html
    for (i = 0; i < categories.length; i++) {
  		displayText(details, categories[i]);
	}
	displayList(details, "locations");
	$("#picture").attr("src",details.picture.value);
	$("#homepage").attr("href",details.homepage.value);
    $("#homepage").text(details.homepage.value);

}

function displayText(details, element){

    if (element in details){
    	let data = details[element]["value"];
		$("#" + element).text(data);
    } else {
    	$("#" + element).text("N/A");
    }
}

function displayList(details, element){

    if (element in details){
    	let data = details[element]["value"];
    	let dataSplitted = data.split(" ");
		let text = "<ul>";
		for (i = 0; i < dataSplitted.length; i++) {
			let uriSplit = dataSplitted[i].split('/');
        	let locationName = uriSplit[uriSplit.length-1].replaceAll("_", " ");
			text += "<li>" + locationName + "</li>";
		}
		text += "</ul>";
		document.getElementById(element).innerHTML = text;

    } else {
    	$("#" + element).text("N/A");
    }

}


