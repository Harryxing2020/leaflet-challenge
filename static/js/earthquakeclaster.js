// Creating map object
var myMap = L.map("map", {
    center: [60.387172, -153.991983],
    zoom: 5
});
// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Store API query variables
var newtry = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


// Grab the data with d3
d3.json(newtry, function (response) {

    // Create a new marker cluster group
    var markers = L.markerClusterGroup();
    // for each the array in feature
    response.features.forEach(element => {
        var location = element.geometry.coordinates;

        // Check for location property
        if (location) {
            // create a popup marker
            var popupString = `<h3>Earthquake near ${element.properties.place}</h3>`;
            popupString += `<h3>Coordinates: ${location[0]}, ${location[1]}</h3> <hr>`;
            popupString += `<h3>Magnitude: ${element.properties.mag}</h3>`;
            popupString += `<h3>Depth: ${location[2]} KM</h3>`;
            popupString += `<h3>Magnitude: ${new Date(element.properties.time)}</h3>`;

            // Add a new marker to the cluster group and bind a pop-up
            markers.addLayer(L.marker([location[1], location[0]])
                .bindPopup(popupString));
        }
    });
    // add the cluster marker into map
    myMap.addLayer(markers);

});



  
