$("#click-submit").click( function (event) {
    event.preventDefault();
    let TextQuery = $("#researchField").val();
    console.log (TextQuery);
    createSparqlRequest(TextQuery);
    } 
);