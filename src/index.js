
    $("#click-submit").click( function (event) {
        event.preventDefault();
        let userRequest = $("#researchField").val();
        console.log (userRequest);
        let sparqlRequest = createSparqlRequest(userRequest);
        let baseURLFull = createHTTPRequest(sparqlRequest);

        //Envoie, récupération et affichage de la requête HTTP
        $.get( baseURLFull, function( data ) {
            $("#result").html("Resultats");
            console.log(data);
            displayResult(data);
        });

        } 
    );

function displayResult(data){

}




