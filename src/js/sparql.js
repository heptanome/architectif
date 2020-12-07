/*
Récupère la requête de l'utilisateur et la transforme en requete SPARQL

@param userRequest : requête utilisateur
@return sparqlRequest : requête sparql
 */
function createSparqlRequest(userRequest) {
    const keyWords = userRequest.split(' ');
    var sparqlRequest = "SELECT DISTINCT ?result ?name WHERE { ?result a dbo:ArchitecturalStructure; foaf:name ?name; rdfs:label ?label. FILTER ( regex(?label, \".*";
    keyWords.forEach(function(item) {
        sparqlRequest = sparqlRequest.concat(item);
    });
    sparqlRequest = sparqlRequest.concat(".*\",\"i\"))} LIMIT 1000 ");
    return sparqlRequest;
}

/*
Récupère une requête sparql et la met sous forme de URI pour lancer une requête HTTP
*/
function createHTTPRequest(sparqlRequest){
    console.log(sparqlRequest);
    let sparqlRequestTestURI = encodeURI(sparqlRequest);
    let baseURL = "http://dbpedia.org/sparql?default-graph-uri=http%3A//dbpedia.org&query=PREFIX%20owl%3A%20%3Chttp%3A//www.w3.org/2002/07/owl%23%3E%0APREFIX%20xsd%3A%20%3Chttp%3A//www.w3.org/2001/XMLSchema%23%3E%0APREFIX%20rdfs%3A%20%3Chttp%3A//www.w3.org/2000/01/rdf-schema%23%3E%0APREFIX%20rdf%3A%20%3Chttp%3A//www.w3.org/1999/02/22-rdf-syntax-ns%23%3E%0APREFIX%20foaf%3A%20%3Chttp%3A//xmlns.com/foaf/0.1/%3E%0APREFIX%20dc%3A%20%3Chttp%3A//purl.org/dc/elements/1.1/%3E%0APREFIX%20%3A%20%3Chttp%3A//dbpedia.org/resource/%3E%0APREFIX%20dbpedia2%3A%20%3Chttp%3A//dbpedia.org/property/%3E%0APREFIX%20dbpedia%3A%20%3Chttp%3A//dbpedia.org/%3E%0APREFIX%20skos%3A%20%3Chttp://www.w3.org/2004/02/skos/core%23%3E%0A";
    let endURL = "&format=application/sparql-results%2Bjson";
    let baseURLFull = baseURL.concat(sparqlRequestTestURI, endURL);

    return baseURLFull;
}

/*
@param uri : l'uri de la structure architecturale demandée
@return sparqlRequest : requête sparql pour obtenir les détails de la structure
*/
function createSparqlRequestForDetails(uri) {
    var sparqlRequest = "SELECT DISTINCT ?name ?picture ?description (GROUP_CONCAT(DISTINCT ?location ; separator=' ') AS ?locations) ?lat ?long ?homepage ?nbVisitors ?architect ?buildStart ?buildEnd WHERE {";
    sparqlRequest = sparqlRequest.concat(uri, "rdf:type dbo:ArchitecturalStructure; rdfs:label ?name; foaf:depiction ?picture; dbo:location ?location; dbo:abstract ?description.");
    sparqlRequest = sparqlRequest.concat("FILTER ( lang(?description) = \"en\" ). FILTER ( lang(?name) = \"en\" ).");
    sparqlRequest = sparqlRequest.concat("OPTIONAL{ ", uri, " foaf:homepage ?homepage .}");
    sparqlRequest = sparqlRequest.concat("OPTIONAL{ ", uri, " dbo:numberOfVisitors ?nbVisitors .}");
    sparqlRequest = sparqlRequest.concat("OPTIONAL{ ", uri, " dbo:architect ?architect .}");
    sparqlRequest = sparqlRequest.concat("OPTIONAL{ ", uri, " dbo:buildingStartDate ?buildStart .}");
    sparqlRequest = sparqlRequest.concat("OPTIONAL{ ", uri, " dbo:buildingEndDate ?buildEnd .}");
    sparqlRequest = sparqlRequest.concat("OPTIONAL{ ", uri, " geo:lat ?lat .}");
    sparqlRequest = sparqlRequest.concat("OPTIONAL{ ", uri, " geo:long ?long .}");
    sparqlRequest = sparqlRequest.concat("}ORDER BY DESC(xsd:integer(?nbVisitors)) LIMIT 1");
    return sparqlRequest;
}



