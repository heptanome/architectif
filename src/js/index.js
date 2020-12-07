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
        displayListResult(data);
    });

    }
);

$("#click-display").click(function () {
    $(".result-item").show();
})

/*
Afficher la liste de résultat de la recherche
*/
function displayListResult(data){
    console.log(data);
    var sizeOfResults = data.results.bindings.length;
    var sizeOfResultsDisplayed = $(".custom-select option:selected").html();
    var resultsDisplayed = 0;
    if (sizeOfResults > 0) {
        var liste = "";
        var results = data.results.bindings
        $(results).each(function (){
            var place = "";
            if ("place" in this) {
                place = this.place.value;
            } else {
                place = "N/A";
            }
            if (resultsDisplayed < sizeOfResultsDisplayed) {
                liste = liste + "<button type=\"button\" class=\"list-group-item result-item\" link=\"" + this.result.value + "\">";
                liste = liste + this.name.value + " -- " + place;
                liste = liste + "</button>\n"
                resultsDisplayed++;
            } else {
                liste = liste + "<button type=\"button\" style=\"display:none; \"class=\"list-group-item result-item\" link=\"" + this.result.value + "\">";
                liste = liste + this.name.value + " -- " + place;
                liste = liste + "</button>\n"
            }
        });
        if (resultsDisplayed < sizeOfResults) {
            $("#click-display").show()
            .append(" ("+sizeOfResults+")");
        } else {
            $("#click-display").hide()
            .html("Display all results");
        }
        

        $("#result_list").html(liste);
    
        /*Gestion de l'évènement "click sur un lien de la liste de résultats*/
        $(".result-item").click(function(event){
            event.preventDefault();
            var link = $(this).attr("link");
            document.location.href = "result.html?data=" + link;
        });
    } else {
        $("#result_list").html("Pas de résultats !");
    }
}




