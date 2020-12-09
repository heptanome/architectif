/**
Récupère la requête de l'utilisateur et la transforme en requete SPARQL

@param userRequest : requête utilisateur
@return sparqlRequest : requête sparql
 */
function createSparqlRequest(userRequest) {
  var sparqlRequest =
    "SELECT DISTINCT ?result ?name (GROUP_CONCAT(DISTINCT ?location ; separator=', ') AS ?place) WHERE { " +
    "?result a dbo:ArchitecturalStructure; foaf:name ?name; rdfs:label ?label. " +
    "OPTIONAL {?result dbo:location ?placeint.?placeint foaf:name ?location.} " +
    'FILTER ( regex(?label, ".*';

  const keyWords = userRequest.split(" ");
  keyWords.forEach(function (item) {
    sparqlRequest = sparqlRequest.concat(item);
    sparqlRequest = sparqlRequest.concat(".*");
  });
  sparqlRequest = sparqlRequest.concat(
    '","i")) FILTER ( lang(?name) = \'en\' ).} ORDER BY ASC (?name) LIMIT 10000 '
  );
  return sparqlRequest;
}

/**
Récupère une requête sparql et la met sous forme de URI pour lancer une requête HTTP

@param sparqlRequest : requête sparql
@return baseURLFull  : renvoie la requête HTTP prête à être envoyée
 */
function createHTTPRequest(sparqlRequest) {
  console.log(sparqlRequest);
  let sparqlRequestTestURI = encodeURI(sparqlRequest);
  let baseURL =
    "http://dbpedia.org/sparql?default-graph-uri=http%3A//dbpedia.org&query=PREFIX%20owl%3A%20%3Chttp%3A//www.w3.org/2002/07/owl%23%3E%0APREFIX%20xsd%3A%20%3Chttp%3A//www.w3.org/2001/XMLSchema%23%3E%0APREFIX%20rdfs%3A%20%3Chttp%3A//www.w3.org/2000/01/rdf-schema%23%3E%0APREFIX%20rdf%3A%20%3Chttp%3A//www.w3.org/1999/02/22-rdf-syntax-ns%23%3E%0APREFIX%20foaf%3A%20%3Chttp%3A//xmlns.com/foaf/0.1/%3E%0APREFIX%20dc%3A%20%3Chttp%3A//purl.org/dc/elements/1.1/%3E%0APREFIX%20%3A%20%3Chttp%3A//dbpedia.org/resource/%3E%0APREFIX%20dbpedia2%3A%20%3Chttp%3A//dbpedia.org/property/%3E%0APREFIX%20dbpedia%3A%20%3Chttp%3A//dbpedia.org/%3E%0APREFIX%20skos%3A%20%3Chttp://www.w3.org/2004/02/skos/core%23%3E%0A";
  let endURL = "&format=application/sparql-results%2Bjson";
  let baseURLFull = baseURL.concat(sparqlRequestTestURI, endURL);

  return baseURLFull;
}

/**
Crée une requête sparql à partir de l'URI de la ressource passée en paramètre.
L'objectif de cette requête est de récupérer un large spectre d'informations sur la ressource.

@param uri : l'uri de la structure architecturale demandée
@return sparqlRequest : requête sparql pour obtenir les détails de la structure
 */
function createSparqlRequestForDetails(uri) {
  return `
SELECT DISTINCT
    ?name ?picture ?description
    (GROUP_CONCAT(DISTINCT ?location ; separator=' ') AS ?locations)
    ?lat ?long ?homepage ?nbVisitors ?architect ?buildStart ?buildEnd WHERE {

      ${uri} rdf:type dbo:ArchitecturalStructure;
      rdfs:label ?name;
      dbo:abstract ?description.
      FILTER (lang(?description) = 'en').
      FILTER (lang(?name) = 'en').
      
      OPTIONAL { ${uri} foaf:depiction ?picture .}
      OPTIONAL { ${uri} dbo:location ?location .}
      OPTIONAL { ${uri} foaf:homepage ?homepage .}
      OPTIONAL { ${uri} dbo:numberOfVisitors ?nbVisitors .}
      OPTIONAL { ${uri} dbo:architect ?architect .}
      OPTIONAL { ${uri} dbo:buildingStartDate ?buildStart .}
      OPTIONAL { ${uri} dbo:buildingEndDate ?buildEnd .}
      OPTIONAL { ${uri} dbp:latitude ?lat .}
      OPTIONAL { ${uri} dbp:longitude ?long .}
      OPTIONAL { ${uri} geo:lat ?lat .}
      OPTIONAL { ${uri} geo:long ?long .}

} ORDER BY DESC(xsd:integer(?nbVisitors)) LIMIT 1
`;
}

// la -> latitude, lo -> longitude
/**
Crée une requête sparql à partir de l'URI de la ressource passée en paramètre.
L'objectif de cette requête est d'obtenir les 20 monuments les plus proches, dans
un rayon de 10 km, de la ressource.

@param uri : l'uri de la structure architecturale demandée
@return sparqlRequest : requête sparql pour obtenir les monuments alentours
 */
function createSparqlRequestForMapDetails(la, lo, name) {
  return `
select ?struct ?name ?latitude ?longitude {
   SELECT DISTINCT ?struct ?name (avg(?lat) as ?latitude) (avg(?long) as ?longitude) {
   ?struct a dbo:ArchitecturalStructure ;
          rdfs:label ?name;
          geo:lat ?lat;
          geo:long ?long .
   FILTER ( bif:st_intersects( bif:st_point (?long, ?lat), bif:st_point (${lo}, ${la}), 10))
   FILTER (?name != "${name}"@en)
   FILTER (lang(?name) = "en")
   }
GROUP BY ?name ?struct
}
ORDER BY bif:haversine_deg_km (?latitude, ?longitude, ${la}, ${lo})
LIMIT 20 
  `;
}

/**
Crée une requête sparql à partir de l'URI de la ressource passée en paramètre.
L'objectif de cette requête est d'obtenir des informations sur les architectes liés à
la construction de la ressource.

@param uri : l'uri de la structure architecturale demandée
@return sparqlRequest : requête sparql pour obtenir les monuments alentours
 */
function createSparqlRequestForArchitectDetails(uri) {
  return `
SELECT DISTINCT
    ?description ?birthDate 
    (GROUP_CONCAT(DISTINCT ?birthPlace ; separator=' ') AS ?birthPlaces)
    ?deathDate (GROUP_CONCAT(DISTINCT ?deathPlace ; separator=' ') AS ?deathPlaces)
    (GROUP_CONCAT(DISTINCT ?nationality ; separator=' ') AS ?nationalities)
    (GROUP_CONCAT(DISTINCT ?significantBuilding ; separator=' ') AS ?buildings)
    WHERE {
      ${uri} rdf:type foaf:Person;
      dbo:abstract ?description.
      FILTER (lang(?description) = 'en').
      OPTIONAL { ${uri} dbo:birthDate ?birthDate .}
      OPTIONAL { ${uri} dbo:birthPlace ?birthPlace .}
      OPTIONAL { ${uri} dbo:deathDate ?deathDate .}
      OPTIONAL { ${uri} dbo:deathPlace ?deathPlace .}
      OPTIONAL { ${uri} dbo:nationality ?nationality .}
      OPTIONAL { ${uri} dbo:significantBuilding ?significantBuilding .}     
} ORDER BY DESC(xsd:date(?birthDate)) LIMIT 1`;
}
