/**
Gestion de l'évènement "click sur le bouton submit principal".
Sous-traite la création de requête sparql et Http à Sparql.js
Envoie la requête, récupère son résultat et l'affiche
*/
$("#click-submit").click(function (event) {
  $('#click-submit').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Loading...');
  event.preventDefault();
  let userRequest = $("#researchField").val();

  if (userRequest != ""){
    let sparqlRequest = createSparqlRequest(userRequest);
    let baseURLFull = createHTTPRequest(sparqlRequest);

    //Envoie, récupération et affichage de la requête HTTP
    $.get(baseURLFull, function (data) {
      displayListResult(data);
      let spinner = $('#click-submit').find('span');
      spinner.removeClass('spinner-border');
      $('#click-submit').html("Submit");
    });
  } else {
    $('#click-submit').html("Submit");
    $("#result_list").html("No key words were found !");
  }

  
});

/**
Réponse à l'évènement "click" sur le bouton display du tableau
 */
$("#click-display").click(function () {
  $(".table tbody tr").show();
  $(this).hide();
});

/**
Réponse à l'évènement "click" sur le bouton "back to search engine"
 */
$("#click-back").click(function (){
  document.location.href = "index.html";
})

/**
Afficher la liste de résultat de la recherche

@param data : le résultat au format json
*/
function displayListResult(data) {
  $("#click-display").hide().html("Display all results");
  var sizeOfResults = data.results.bindings.length;
  var sizeOfResultsDisplayed = $(".custom-select option:selected").html();
  var resultsDisplayed = 0;
  var resultsLoaded = 1;
  var liste2 = "";
  if (sizeOfResults > 0) {
    var liste = "";
    var results = data.results.bindings;
    $(results).each(function () {
      var place = "";
      if (this.place) {
        place = this.place.value;
      } else {
        place = "N/A";
      }
      if (resultsDisplayed < sizeOfResultsDisplayed) {
        res = createLigne(
          resultsLoaded,
          this.label.value,
          place,
          this.result.value,
          ""
        );
        liste2 += res;
        resultsDisplayed++;
        resultsLoaded++;
      } else {
        res = createLigne(
          resultsLoaded,
          this.label.value,
          place,
          this.result.value,
          "display:none;"
        );
        liste2 += res;
        resultsLoaded++;
      }
    });
    if (resultsDisplayed < sizeOfResults) {
      $("#click-display")
        .show()
        .html("Display all results (" + sizeOfResults + ")");
    }

    $(".table tbody").html(liste2);
    $("#result_list").html("");

    //Gestion de l'évènement "click sur un lien de la liste de résultats
    $(".table tbody tr").click(function () {
      var link = $(this).attr("link");
      link = link.split("/");

      document.location.href = "result.html?b=" + link[link.length - 1];
    });
  } else {
    $("#result_list").html("No results were found!");
    $(".table tbody").html(liste2);
  }
}

/**
Crée une nouvelle ligne dans la liste de résultats.

@param numero   : numéro de ligne
@param name     : nom du monument à afficher
@param place    : lieu du monument
@param link     : lien vers le fichiers css
@param cssStyle : style css utilisé
@return         : une ligne de tableau html
 */
function createLigne(numero, name, place, link, cssStyle) {
  var htmlLigne = `
    <tr style="${cssStyle}" link="${link}">
      <th scope="row">${numero}</th>
      <td>${name}</td>
      <td>${place}</td>
    </tr>
    `;
  return htmlLigne;
}
