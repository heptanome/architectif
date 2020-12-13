/**
Récupère la requête de l'utilisateur et la transforme en requete SPARQL
Cette requête doit être formulée en anglais. La requête est insensible à la casse
mais elle est sensible à l'ordre des mots clés utilisés par l'utilisateur.

@param userRequest    : requête utilisateur
@return sparqlRequest : requête sparql
 */
function createSparqlRequest(userRequest) {
  var sparqlRequest =
    "SELECT DISTINCT ?result ?label (GROUP_CONCAT(DISTINCT ?location ; separator=', ') AS ?place) WHERE { " +
    "?result a dbo:ArchitecturalStructure; " +
    "rdfs:label ?label. " +
    "OPTIONAL {?result dbo:location ?placeint.?placeint foaf:name ?location.} " +
    'FILTER ( regex(?label, ".*';

  const keyWords = userRequest.split(" ");
  keyWords.forEach(function (item) {
    sparqlRequest = sparqlRequest.concat(item);
    sparqlRequest = sparqlRequest.concat(".*");
  });
  sparqlRequest = sparqlRequest.concat(
    '","i")) FILTER ( lang(?label) = \'en\' ).} ORDER BY ASC(STRLEN(?label)) LIMIT 200 '
  );
  return sparqlRequest;
}

/**
Récupère une requête sparql et la met sous forme de URI pour lancer une requête HTTP

@param sparqlRequest : requête sparql
@return baseURLFull  : renvoie la requête HTTP prête à être envoyée
 */
function createHTTPRequest(sparqlRequest) {
  let sparqlRequestTestURI = encodeURI(sparqlRequest);
  let baseURL =
    "http://dbpedia.org/sparql?default-graph-uri=http%3A//dbpedia.org&query=PREFIX%20owl%3A%20%3Chttp%3A//" +
    "www.w3.org/2002/07/owl%23%3E%0APREFIX%20xsd%3A%20%3Chttp%3A//www.w3.org/2001/XMLSchema%23%3E%0APREFIX%20rdfs%3A%20%3Chttp%3A//" +
    "www.w3.org/2000/01/rdf-schema%23%3E%0APREFIX%20rdf%3A%20%3Chttp%3A//www.w3.org/1999/02/22-rdf-syntax-ns%23%3E%0APREFIX%20foaf%3" +
    "A%20%3Chttp%3A//xmlns.com/foaf/0.1/%3E%0APREFIX%20dc%3A%20%3Chttp%3A//purl.org/dc/elements/1.1/%3E%0APREFIX%20%3A%20%3Chttp%3A" +
    "//dbpedia.org/resource/%3E%0APREFIX%20dbpedia2%3A%20%3Chttp%3A//dbpedia.org/property/%3E%0APREFIX%20dbpedia%3A%20%3Chttp%3A" +
    "//dbpedia.org/%3E%0APREFIX%20skos%3A%20%3Chttp://www.w3.org/2004/02/skos/core%23%3E%0A";
  let endURL = "&format=application/sparql-results%2Bjson";
  let baseURLFull = baseURL.concat(sparqlRequestTestURI, endURL);

  return baseURLFull;
}

/**
Crée une requête sparql à partir de l'URI de la ressource passée en paramètre.
L'objectif de cette requête est de récupérer un large spectre d'informations sur la ressource.
Parmi ces informations sont comprises : une présentation du monument, un lien vers son site officiel
le nombre de visiteurs, ses coordonnées GPS, son emplacement, son architecte, sa période de construction
et une image. Seule la description est une information obligatoire. Elle est en anglais

@param uri            : l'uri de la structure architecturale demandée
@return sparqlRequest : requête sparql pour obtenir les détails de la structure
 */
function createSparqlRequestForDetails(uri) {
  return `
SELECT DISTINCT
    ?name ?picture ?description
    (REPLACE (GROUP_CONCAT(DISTINCT ?location ; separator=' '), "http://dbpedia.org/resource/", "") AS ?locations)
	?lat ?long ?homepage ?nbVisitors ?architect ?buildStart ?buildEnd WHERE {

	${uri} rdfs:label ?name;
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

/**
Crée une requête sparql à partir de l'URI de la ressource passée en paramètre.
L'objectif de cette requête est d'obtenir les 20 monuments les plus proches, dans
un rayon de 10 km, de la ressource.

@param la             : latitude du monument
@param lo             : longitude du monument 
@param name           : label du monument
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
la construction de la ressource. On obtient en résultat une présentation de l'architecte,
la date et le lieu de naissance ainsi que de mort de l'architecte, sa ou ses narionalités 
et une liste des lieux qu'il a construit. Seule la mention de la présentation de
l'architecte est obligatoire. Cette présentation est en anglais.

@param uri            : l'uri de l'architecte
@return sparqlRequest : requête sparql pour obtenir les informations principales de l'architecte
 */
function createSparqlRequestForArchitectDetails(uri) {
  return `
SELECT DISTINCT
    ?description ?birthDate 
    (REPLACE (GROUP_CONCAT(DISTINCT ?bPlace ; separator=', '), "http://dbpedia.org/resource/", "") AS ?birthPlace)
    ?deathDate
    (REPLACE (GROUP_CONCAT(DISTINCT ?dPlace ; separator=', '), "http://dbpedia.org/resource/", "") AS ?deathPlace)
    (REPLACE (GROUP_CONCAT(DISTINCT ?nationality ; separator=' '), "http://dbpedia.org/resource/", "") AS ?nationality)
    (REPLACE (GROUP_CONCAT(DISTINCT ?significantBuilding ; separator=' '), "http://dbpedia.org/resource/", "") AS ?creatorOf)
    WHERE {
      ${uri} rdf:type foaf:Person;
      dbo:abstract ?description.
      FILTER (lang(?description) = 'en').
      OPTIONAL { ${uri} dbo:birthDate ?birthDate .}
      OPTIONAL { ${uri} dbo:birthPlace ?bPlace .}
      OPTIONAL { ${uri} dbo:deathDate ?deathDate .}
      OPTIONAL { ${uri} dbo:deathPlace ?dPlace .}
      OPTIONAL { ${uri} dbo:nationality ?nationality .}
      OPTIONAL { ${uri} dbo:significantBuilding ?significantBuilding .}     
} ORDER BY DESC(xsd:date(?birthDate)) LIMIT 1`;
}

/**
 Crée une requête sparql à partir du nom de la localisation d'une construction passée en paramètre.
 Cette localisation doit être en anglais. 
 L'objectif de cette requête est d'obtenir un résumé de la localisation passée en paramètre.

 @param location       : Nom de la localisation
 @return sparqlRequest : requête sparql pour obtenir les monuments alentours
 */
function createSparqlRequestForLocation(location) {
  return `
SELECT DISTINCT ?result ?abs
  WHERE { 
    ?result a dbo:Location; 
    rdfs:label ?label;
    dbo:abstract ?abs.
    FILTER ( regex(?label, "^${location}$","i")). FILTER ( lang(?abs) = "en" ).
  } 
  GROUP BY ?result
  LIMIT 1`;
}
