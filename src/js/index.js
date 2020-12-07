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
        displayListResult(data);
    });

    }
);

/*
Afficher la liste de résultat de la recherche
*/
function displayListResult(data){
    var liste = "";
    $(data.results.bindings).each(function (){
        liste = liste + "<button type=\"button\" class=\"list-group-item result-item\">";
        liste = liste + this.result.value;
        liste = liste + "</button>\n"
    })

    $("#result_list").html(liste);
    
    /*Gestion de l'évènement "click sur un lien de la liste de résultats*/
    $(".result-item").click(function(event){
        event.preventDefault();
        var link = $(this).html();
        document.location.href = "result.html?data=" + link;

    });
}




