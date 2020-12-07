/*
Gestion de l'évènement "click sur le bouton submit principale".
Sous-traite la création de requête sparql et Http à Sparql.js
Envoie la requête, récupère son résultat et l'affiche
*/
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
        redirectPageResult(data);
    });

    }
);

/*
Afficher la liste de résultat de la recherche
*/
function redirectPageResult(data){
	document.location.href="result.html?data="+"http://dbpedia.org/resource/Eiffel_Tower"; 
	//document.location.href="result.html?data="+data; 
}




