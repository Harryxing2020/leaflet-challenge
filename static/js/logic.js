///////////////////////////////////////////////////////////////////////
// Create a map object
///////////////////////////////////////////////////////////////////////

var myMap = L.map("map", {
    center: [60.387172, -153.991983],
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

// Json URL for the earthquake above 2.5 
link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

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
// Grabbing our GeoJSON data..
///////////////////////////////////////////////////////////////////////
d3.json(link, function (data) {

    var earthquakeLocations = [];

    // get each location data from array 
    data.features.forEach(element => {

        // if the coordinates is not empty
        if (element.geometry.coordinates) {

            //define a json 
            var location = {
                place: element.properties.place,
                time: new Date(element.properties.time),
                location: [element.geometry.coordinates[1], element.geometry.coordinates[0]],
                depth: element.geometry.coordinates[2],
                mag: element.properties.mag
            };
            //push the item into array
            earthquakeLocations.push(location);
        };
    });

    ///////////////////////////////////////////////////////////////////////
    // create circles and popups
    ///////////////////////////////////////////////////////////////////////

    // for each location in the array
    earthquakeLocations.forEach(element => {
        // html for the popup marker
        popupString = `<h3>Locaton: ${element.place}</h3> <hr>`;
        popupString += `<h3>Magnitude:${element.time}</h3>`;
        popupString += `<h3>Magnitude:${element.mag}</h3>`;
        popupString += `<h3>Depth:${element.depth} KM</h3>`;

        // add circle and popup content
        L.circle(element.location, {
            stroke: true,
            fillOpacity: 0.75,
            color: "pink",
            fillColor: getColor(element.depth),
            radius: markerSize(element.mag)
        }).bindPopup(popupString).addTo(myMap);

    })

    ///////////////////////////////////////////////////////////////////////
    // create legends
    ///////////////////////////////////////////////////////////////////////

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend');
        var limits = [-10, 10, 30, 50, 70, 90];

        for (var i = 0; i < limits.length; i++) {
            var newHtml = `<i style="background: ${getColor(limits[i])}"></i>`;

            newHtml += limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');

            div.innerHTML += newHtml;
        }

        return div;
    };

    legend.addTo(myMap);
})





