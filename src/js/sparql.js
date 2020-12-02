/*
Récupère la requête de l'utilisateur et la transforme en requete SPARQL

@param userRequest : requête utilisateur
@return sparqlRequest : requête sparql
 */
function createSparqlRequest(userRequest) {
    const keyWords = userRequest.split(' ');
    var sparqlRequest = "SELECT DISTINCT ?result WHERE { ?result a dbo:ArchitecturalStructure; rdfs:label ?label. FILTER ( regex(?label, \".*";
    keyWords.forEach(function(item) {
        sparqlRequest = sparqlRequest.concat(item);
    });
    sparqlRequest = sparqlRequest.concat("\"))} LIMIT 200 ");

    return sparqlRequest;
}

function createHTTPRequest(sparqlRequest){
    console.log(sparqlRequest);
    let sparqlRequestTestURI = encodeURI(sparqlRequest);
    let baseURL = "http://dbpedia.org/sparql?default-graph-uri=http%3A//dbpedia.org&query=PREFIX%20owl%3A%20%3Chttp%3A//www.w3.org/2002/07/owl%23%3E%0APREFIX%20xsd%3A%20%3Chttp%3A//www.w3.org/2001/XMLSchema%23%3E%0APREFIX%20rdfs%3A%20%3Chttp%3A//www.w3.org/2000/01/rdf-schema%23%3E%0APREFIX%20rdf%3A%20%3Chttp%3A//www.w3.org/1999/02/22-rdf-syntax-ns%23%3E%0APREFIX%20foaf%3A%20%3Chttp%3A//xmlns.com/foaf/0.1/%3E%0APREFIX%20dc%3A%20%3Chttp%3A//purl.org/dc/elements/1.1/%3E%0APREFIX%20%3A%20%3Chttp%3A//dbpedia.org/resource/%3E%0APREFIX%20dbpedia2%3A%20%3Chttp%3A//dbpedia.org/property/%3E%0APREFIX%20dbpedia%3A%20%3Chttp%3A//dbpedia.org/%3E%0APREFIX%20skos%3A%20%3Chttp://www.w3.org/2004/02/skos/core%23%3E%0A";
    let endURL = "&format=application/sparql-results%2Bjson";
    let baseURLFull = baseURL.concat(sparqlRequestTestURI, endURL);
    console.log(baseURLFull);
    $.get( baseURLFull, function( data ) {
        $("#result").html("Resultats");
        console.log(data);
      });
}
