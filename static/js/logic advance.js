
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



// Store our API endpoint inside queryUrl
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";
var tectonicplatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";



// Perform a GET request to the query URL
d3.json(earthquakeUrl, function (earthquakeData) {

    d3.json(tectonicplatesUrl, function (tectonicplatesData) {
        // Once we get a response, send the data.features object to the createFeatures function    
        createFeatures(earthquakeData.features, tectonicplatesData.features);
    });
});


function createFeatures(earthquakeData, tectonicplatesData) {

    function onEachFeature(feature, layer) {
        var popupString = `<h3>Earthquake near ${feature.properties.place}</h3>`;
        popupString += `<h3>Coordinates: ${feature.geometry.coordinates[0]}, ${feature.geometry.coordinates[1]}</h3> <hr>`;
        popupString += `<h3>Magnitude: ${feature.properties.mag}</h3>`;
        popupString += `<h3>Depth: ${feature.geometry.coordinates[2]} KM</h3>`;
        popupString += `<h3>Magnitude: ${new Date(feature.properties.time)}</h3>`;
        layer.bindPopup(popupString);
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,

        pointToLayer: function (feature, latlng) {
            return L.circle(latlng, {
                stroke: true,
                fillOpacity: 0.75,
                color: "black",
                fillColor: getColor(feature.geometry.coordinates[2]),
                radius: markerSize(feature.properties.mag)
            });
        }
    });


    var tectonicplates = L.geoJSON(tectonicplatesData, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng);
        }
    });



    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes, tectonicplates);
}

function createMap(earthquakes, tectonicplates) {

    // Define streetmap and darkmap layers
    var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
         tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v9",
        accessToken: API_KEY
    });


    var outdoorMap =L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
      });


    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Satellite": satelliteMap,
        "Grayscale": grayscaleMap,
        "Outdoor": outdoorMap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Fault Lines": tectonicplates
    };


    var myMap = L.map("map", {
        center: [39.325019, 14.261067],
        zoom: 3,
        layers: [satelliteMap, tectonicplates, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}
