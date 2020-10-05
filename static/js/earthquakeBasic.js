
///////////////////////////////////////////////////////////////////////
// Main entrance 
///////////////////////////////////////////////////////////////////////
// inital the map and set the center of map at 60.387172, -153.991983
var myMap = initialMap([60.387172, -153.991983]);
// Json URL for the earthquake above 2.5 
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

d3.select("#bar-title").text("Earthquake M2.5+ data in the past 30 days ")

//grabbing GeoJson
grabbingGeoJson(earthquakeUrl, myMap)

// create Legend and popups
addLegend().addTo(myMap);


///////////////////////////////////////////////////////////////////////
// main end 
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
// function1: return the color by the depth 
///////////////////////////////////////////////////////////////////////

function getColor(depth) {

    if (depth >= 90) {
        return '#BD0026';
    }
    else if (depth >= 70 && depth < 90) {
        return '#E31A1C';
    }
    else if (depth >= 50 && depth < 70) {
        return '#FC4E2A';
    }
    else if (depth >= 30 && depth < 50) {
        return '#FD8D3C';
    }
    else if (depth >= 10 && depth < 30) {
        return '#FEB24C';
    }
    else if (depth >= -10 && depth < 10) {
        return '#80ffdd';
    }
    else {
        return '#fff';
    }
};
///////////////////////////////////////////////////////////////////////
// function1: end 
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
// function2: setup the size of radius by the Magnitude
///////////////////////////////////////////////////////////////////////
function markerSize(mag) {
    return mag * 15000;
}
///////////////////////////////////////////////////////////////////////
// function2: end 
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
// function3: initial map 
///////////////////////////////////////////////////////////////////////
function initialMap(coordinates) {
    //create a map
    var myMap = L.map("map", {
        center: coordinates,
        zoom: 5
    });

    // Adding tile layer
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    }).addTo(myMap);

    return myMap;


}

///////////////////////////////////////////////////////////////////////
// function3: end 
///////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////
// function4: create legends
///////////////////////////////////////////////////////////////////////

function addLegend() {
    // Create a legend for the map
    var legend = L.control({ position: 'bottomright' });
    // Legend will be called once map is displayed
    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend');

        var legendInfo = "<p>Depth(KM)</p>";

        div.innerHTML = legendInfo;

        // setup the depth 
        var limits = [-10, 10, 30, 50, 70, 90];
        // Loop through our magnitude intervals and generate a label with a colored square for each interval
        for (var i = 0; i < limits.length; i++) {
            var newHtml = `<i style="background: ${getColor(limits[i])}"></i>`;

            newHtml += limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');

            div.innerHTML += newHtml;
        }

        return div;
    };
    // Add the legend to the map
    return legend;

}
///////////////////////////////////////////////////////////////////////
// function4: end
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
// function5: Grabbing our GeoJSON data..
///////////////////////////////////////////////////////////////////////
function grabbingGeoJson(earthquakeUrl, myMap) {

    // Grabbing our GeoJSON data..

    d3.json(earthquakeUrl, function (data) {

        // get each location data from array 
        data.features.forEach(element => {

            // if the coordinates is not empty
            if (element.geometry.coordinates) {

                var popupString = `<h3>Earthquake near ${element.properties.place}</h3>`;
                popupString += `<h3>Coordinates: ${element.geometry.coordinates[0]}, ${element.geometry.coordinates[1]}</h3> <hr>`;
                popupString += `<h3>Magnitude: ${element.properties.mag}</h3>`;
                popupString += `<h3>Depth: ${element.geometry.coordinates[2]} KM</h3>`;
                popupString += `<h3>Magnitude: ${new Date(element.properties.time)}</h3>`;

                // add circle and popup content
                L.circle([element.geometry.coordinates[1], element.geometry.coordinates[0]], {
                    stroke: true,
                    fillOpacity: 0.75,
                    color: "black",
                    fillColor: getColor(element.geometry.coordinates[2]),
                    radius: markerSize(element.properties.mag)
                }).bindPopup(popupString).addTo(myMap);

            };
        });

    })

}
///////////////////////////////////////////////////////////////////////
// function5: end
///////////////////////////////////////////////////////////////////////
