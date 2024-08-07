



// Helper Functions.

function getMarkerOptions(row) {
    let markerOptions = {
        radius: 10000,
        fillColor: "black",
        color: "transparent",
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.75
    };

    return markerOptions;
}

// Generate Popup HTML.
function createPopupHTML(row) {
    return `<div id="popup-graph-${row.port_code}"></div>`;
}

function createSunburst(row) {
    // Create a Sunburst chart for each popup.
    let url = `/api/v1.0/populate_popup/${row.port_code}`;
    d3.json(url).then(function(data) {
        // Declare a variable to store items while looping.
        let iter = {
            "port": data[0].port_code,
            "year": {
                "id": null,
                "index": null
            },
            "month": {
                "id": null,
                "index": null
            },
            "measure": {
                "id": null,
                "index": null
            },
        };

        // Declare variables to store our data.
        // Note: initialized with proper starting values for the graph.
        let ids = [`${data[0].port_code}`];
        let labels = [`${data[0].port_name}, ${data[0].state}<br>Port Code: ${data[0].port_code}`];
        let parents = [""];
        let values = [0];
        
        // Begin our loop.
        for (let i = 0; i < data.length; i++) {
            let r = data[i];

            // Year.
            if (r.year != iter["year"]["id"]) {
                iter["year"]["id"] = r.year;

                ids.push(`${r.year}`);
                labels.push(`${r.year}`);
                parents.push(`${iter["port"]}`);

                iter["year"]["index"] = (values.push(r.value) - 1);
                values[0] += r.value;
            } else {
                values[iter["year"]["index"]] += r.value;
                values[0] += r.value;
            }

            // Month.
            if (r.month != iter["month"]["id"]) {
                iter["month"]["id"] = r.month;

                ids.push(`${iter["year"]["id"]}-${r.month}`);
                labels.push(`${r.month}`);
                parents.push(`${iter["year"]["id"]}`);

                iter["month"]["index"] = (values.push(r.value) - 1);
                values[0] += r.value;
            } else {
                values[iter["month"]["index"]] += r.value;
                values[0] += r.value;
            }

            // Measure.
            if (r.measure != iter["measure"]["id"]) {
                iter["measure"]["id"] = r.measure;

                ids.push(`${iter["year"]["id"]}-${iter["month"]["id"]}-${r.measure}`);
                labels.push(`${r.measure}`);
                parents.push(`${iter["year"]["id"]}-${iter["month"]["id"]}`);

                iter["measure"]["index"] = (values.push(r.value) - 1);
                values[0] += r.value;
            } else {
                values[iter["measure"]["index"]] += r.value;
                values[0] += r.value;
            }
        };

        let sunburstData = [{
            type: "sunburst",
            ids: ids,
            labels: labels,
            parents: parents,
            values: values,
            outsidetextfont: {size: 20, color: "#377eb8"},
            leaf: {opacity: 0.5},
            marker: {line: {width: 2}},
            branchvalues: 'total'
        }];

        let layout = {
            margin: {l: 0, r: 0, b: 0, t: 0},
            height: 500,
            width: 500
        };

        Plotly.newPlot(`popup-graph-${row.port_code}`, sunburstData, layout);
    });
}


// Create the Map.
function createMap(data) {
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let baseLayers = {
        Street: street,
        Topography: topo
    };

    // Create the data layer.
    // Create a layer group for the markers.
    let portLayer = L.layerGroup();

    // Loop thru the data and create each point.
    for (let i = 0; i < data.length; i++) {
        // Isolate the row.
        let row = data[i];

        // Grab the coordinates and make a point.
        let lat = row.latitude;
        let lng = row.longitude;
        let latlng = [lat, lng];

        // Make a marker.
        let marker = L.circle(latlng, getMarkerOptions(row));

        // Make the popup for the marker.
        let popup = createPopupHTML(row);
        marker.bindPopup(popup);
        
        // Define the custom events for the marker.
        marker.on({
            // "Select" a marker being hovered.
            mouseover: function (e) {
                layer = e.target;
                layer.setStyle({
                    fillOpacity: 0.9
                });
            },
            // "Deselect" a marker after being hovered.
            mouseout: function (e) {
                layer = e.target;
                layer.setStyle({
                    fillOpacity: 0.5
                });
            },
            // Populate a graph (and table.. below map area?) for the port upon selecting it.
            click: function (e) {
                layer = e.target;

                createSunburst(row);
            }
        });

        marker.addTo(portLayer);
    }

    let dataLayers = {
        Ports: portLayer
    };

    // Initialize the map.
    let myMap = L.map("map", {
        center: [37.0902, -95.7129],
        zoom: 4,
        layers: [street, portLayer]
    });

    // Create the layer control.
    L.control.layers(baseLayers, dataLayers).addTo(myMap);
}

// Initialize.
function init() {
    let url = `/api/v1.0/populate_map`;
    
    d3.json(url).then(function(data) {
        createMap(data);
    });
}


// Run it.
init();