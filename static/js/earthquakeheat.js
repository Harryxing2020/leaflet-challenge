var myMap = L.map("map", {
    center: [32.710181, -123.224670],
    zoom: 3,
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

var newtry = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(newtry, function (response) {
    var heatArray = [];
    response.features.forEach(element => {
        var location = element.geometry.coordinates;
        // if the coordinates is not empty
        if (location) {
            //define a json 
            heatArray.push([location[1],location[0], location[2]]);
        };
    })


    console.log(heatArray.length)

    var heat = L.heatLayer(heatArray, {
        radius: 25,
        blur: 10
    }).addTo(myMap)

})

