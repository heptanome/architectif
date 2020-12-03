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

    //Fill html
    //TODO : quand un champ n'a pas de réponse, cacher le conteneur html
    $("#name").text(details.name.value);
    $("#picture").attr("src",details.picture.value);
    $("#description").text(details.description.value);
    $("#homePage").attr("href",details.homepage.value);
    $("#homePage").text(details.homepage.value);
    $("#nbVisitors").text(details.nbVisitors.value);
    $("#location").text(details.locations.value); //TODO : gérer autrement car il peut y en avoir plusieurs
    $("#latitude").text(details.lat.value);
    $("#longitude").text(details.long.value);
    $("#architect").text(details.architect.value);
    $("#startDate").text(details.buildStart.value);
    $("#endDate").text(details.buildEnd.value);
}






