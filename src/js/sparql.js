function createSparqlRequest(TextQuery) {
    var sparqlRequest = "test";

    return sparqlRequest;
}

function createHTTPRequest(sparqlRequest){
    let sparqlRequestTest = "http://dbpedia.org/sparql?default-graph-uri=http%3A//dbpedia.org&query=PREFIX%20owl%3A%20%3Chttp%3A//www.w3.org/2002/07/owl%23%3E%0APREFIX%20xsd%3A%20%3Chttp%3A//www.w3.org/2001/XMLSchema%23%3E%0APREFIX%20rdfs%3A%20%3Chttp%3A//www.w3.org/2000/01/rdf-schema%23%3E%0APREFIX%20rdf%3A%20%3Chttp%3A//www.w3.org/1999/02/22-rdf-syntax-ns%23%3E%0APREFIX%20foaf%3A%20%3Chttp%3A//xmlns.com/foaf/0.1/%3E%0APREFIX%20dc%3A%20%3Chttp%3A//purl.org/dc/elements/1.1/%3E%0APREFIX%20%3A%20%3Chttp%3A//dbpedia.org/resource/%3E%0APREFIX%20dbpedia2%3A%20%3Chttp%3A//dbpedia.org/property/%3E%0APREFIX%20dbpedia%3A%20%3Chttp%3A//dbpedia.org/%3E%0APREFIX%20skos%3A%20%3Chttp%3A//www.w3.org/2004/02/skos/core%23%3E%0ASELECT%20%3Fs%20%3Fn%20%3Fa%20WHERE%20%7B%20%0D%0A%0D%0A%3Fs%20rdf%3Atype%20dbo%3AArchitecturalStructure%3B%20%0D%0Adbo%3Alocation%20dbr%3ALyon%20.%0D%0A%7D%0D%0ALIMIT%20100&format=application/sparql-results%2Bjson";
    $.get( sparqlRequestTest, function( data ) {
        $("#result").html("Resultats");
        console.log(data);
      });
}