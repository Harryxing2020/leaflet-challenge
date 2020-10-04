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

link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

function getColor(depth) {

    if (depth > 90) {
        return '#cb5554';
    }
    else if (depth > 70 && depth <= 90) {
        return '#d37164';
    }
    else if (depth > 50 && depth <= 70) {
        return '#dc8d73';
    }
    else if (depth > 30 && depth <= 50) {
        return '#e5aa83';
    }
    else if (depth > 10 && depth <= 30) {
        return '#f6e2a2';
    }
    else if (depth >= -10 && depth <= 10) {
        return '#ffffb2';
    }
    else {
        return '#fff';
    }
}


function markerSize(mag) {

    return mag * 13000;
}

// Grabbing our GeoJSON data..
d3.json(link, function (data) {

    var earthquakeLocations = [];

    data.features.forEach(element => {

        if (element.geometry.coordinates) {

            var location = {
                place: element.properties.place,
                time: element.properties.time,
                location: [element.geometry.coordinates[1], element.geometry.coordinates[0]],
                depth: element.geometry.coordinates[2],
                mag: element.properties.mag
            };

            earthquakeLocations.push(location);
        };
    });

    earthquakeLocations.forEach(element => {


        popupString = "<h1>" + element.place + "</h1> <hr> <h3>Magnitude:" + element.mag + "</h3>";

        popupString += "<h3>Depth:" + element.depth + " KM</h3>";

        L.circle(element.location, {
            fillOpacity: 0.75,
            color: "yellow",
            fillColor: getColor(element.depth),
            radius: markerSize(element.mag)
        }).bindPopup(popupString).addTo(myMap);

    })
    //////////////////////////////////////////////////////////////////////////////////////////////


    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend');
        var limits = ["-10", "10",  "30", "50","70", "90"];
        var colors = ["#ffffb2", "#f6e2a2", "#e5aa83", "#dc8d73", "#d37164", "#cb5554"];

        for (var i = 0; i < limits.length; i++) {
            var newHtml = '<i style="background:' + colors[i] + '"></i> ' + limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
            div.innerHTML += newHtml;
        }

        return div;
    };

    legend.addTo(myMap);
})





