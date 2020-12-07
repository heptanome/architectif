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
    $(".table tbody tr").show();
})

/*
Afficher la liste de résultat de la recherche
*/
function displayListResult(data){
    console.log(data);
    var sizeOfResults = data.results.bindings.length;
    var sizeOfResultsDisplayed = $(".custom-select option:selected").html();
    var resultsDisplayed = 0;
    var resultsLoaded = 1;
    var liste2 = "";
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
                res = createLigne(resultsLoaded, this.name.value, place, this.result.value, "");
                liste2 += res;
                resultsDisplayed++;
                resultsLoaded++;
            } else {
                res = createLigne(resultsLoaded, this.name.value, place, this.result.value, "display:none;");
                liste2 += res;
                resultsLoaded++;
            }
        });
        if (resultsDisplayed < sizeOfResults) {
            $("#click-display").show()
            .html("Display all results ("+sizeOfResults+")");
        } else {
            $("#click-display").hide()
            .html("Display all results");
        }
        
        $(".table tbody").html(liste2);
    
        /*Gestion de l'évènement "click sur un lien de la liste de résultats*/
        $(".table tbody tr").click(function(){
            var link = $(this).attr("link");
            document.location.href = "result.html?data=" + link;
        });
    } else {
        $("#result_list").html("Pas de résultats !");
        $(".table tbody").html(liste2);
    }
}

function createLigne (numero, name, place, link, cssStyle){
    var htmlLigne = 
     `
    <tr style="${cssStyle}" link="${link}">
      <th scope="row">${numero}</th>
      <td>${name}</td>
      <td>${place}</td>
    </tr>
    ` ;
    return htmlLigne;
};




