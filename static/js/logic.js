// Create a map object
var myMap = L.map("map", {
    center: [40.500366, -111.540215],
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

link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

locations = [];

console.log("-----------------1-------------------");
// Grabbing our GeoJSON data..
d3.json(link, function (data) {

    data.features.forEach(element=>{

        var location = {
            place: element.properties.place,
            time:  element.properties.time,
            location: [element.geometry.coordinates[1], element.geometry.coordinates[0]],
            depth: element.geometry.coordinates[2],
            mag: element.properties.mag
        };

        locations.push(location);
    });

})

console.log(locations);


function markerSize(mag) {
    return mag * 1500;
}

locations.forEach(location => {

    var color = "red"
    // if (location.depth >= 200) {
    //     color = "yellow"
    // } else if (country.points >= 100) {
    //     color = "blue"
    // } else if (country.points >= 90) {
    //     color = "green"
    // }

    L.circle(country.location, {
        fillOpacity: 0.75,
        color: "white",
        fillColor: color,
        radius: markerSize(location.mag)
    }).bindPopup("<h1>" + country.name + "</h1> <hr> <h3>Points: " + country.points + "</h3>").addTo(myMap);
})
