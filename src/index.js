$(document).ready(function(){

    $("#click-submit").click( function (event) {
        event.preventDefault();
        let userRequest = $("#researchField").val();
        console.log (userRequest);
        let sparqlRequest = createSparqlRequest(userRequest);
        createHTTPRequest(sparqlRequest);
        } 
    );

});