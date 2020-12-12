
function displayLocation(details, element, idHtml) {
  let data = details[element]["value"];
  let dataSplitted = data.split(" ");
  let text = "";
  if(dataSplitted[0] == "") {
    $("#" + idHtml).parent().addClass("d-none");
  } else {
    for (let i = 0; i < dataSplitted.length; i++) {
      let locationName = dataSplitted[i];
      let locationId = locationName.replace(/ /g, "");

      loadRequest(locationName, locationId, idHtml);
    }
  }
}


function loadRequest(locationName,locationId,idHtml){
  let locationNameParsed = locationName.replaceAll("_", " ");
  let sparqlRequest = createSparqlRequestForLocation(locationNameParsed);
  let baseURLFull = createHTTPRequest(sparqlRequest);
  
  // Send http request and fetch json result
  fetch(baseURLFull)
      .then((response) => response.json())
      .then((data) => {
        let text="";
        if(data.results.bindings.length !=0){
          let abstract = data.results.bindings[0].abs.value;
            text += "<li><a data-toggle=\"collapse\" href=\"#collapse"
            		+locationId
            		+"\" aria-expanded=\"false\" aria-controls=\"collapse"
            		+locationId
            		+"\">"
            		+locationName
            		+"</a></li>\n<div  class=\"collapse\" id=\"collapse"
            		+locationId
            		+"\">\n<div id=\"collapse-body-"
            		+locationId
            		+"\" class=\"card card-body\">"
            		+abstract
            		+"</div>\n</div>";
        }else if(locationNameParsed !=""){
          text += "<li>"+locationNameParsed+"</li>\n";
        }

        $("#" + idHtml).append(text);

      })
      .catch((error) => {
        console.error("Error:", error);
      });
}