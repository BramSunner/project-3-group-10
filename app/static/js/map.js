


// Helper Functions.
// Return style options for marker.
function getMarkerOptions(row) {
    
    // Note: ... can dynamically change color of marker.
    // based on.....?
    let markerOptions = {
        radius: 7500,
        fillColor: "#084c61",
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

// Convert numeric months to English months for easier reading.
function convertMonth(month) {
    // let months = {
    //     1: "Jan",
    //     2: "Feb",
    //     3: "Mar",
    //     4: "Apr",
    //     5: "May",
    //     6: "Jun",
    //     7: "Jul",
    //     8: "Aug",
    //     9: "Sep",
    //     10: "Oct",
    //     11: "Nov",
    //     12: "Dec"
    // };

    let months = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
    };

    return months[month];
}

// Format Sunburst chart labels for easier reading.
function formatMeasure(measure) {
    if (typeof measure === "string") {
        measure = measure.replaceAll(' ', '<br>');
    }

    return measure;
}

// Generate Sunburst chart for a popup.
function createSunburst(row) {
    // URL for the request. Using our API structure.
    let url = `/api/v1.0/requestData?where=port_code=${row.port_code}&order_by=year:DESC,month:DESC,measure:DESC`

    d3.json(url).then(function(data) {
        // A variable to remember iterations.
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

        // Variables to store Sunburst chart data.
        // Note: initialized with first index prepared.
        let ids = [`${data[0].port_code}`];
        let labels = [`${data[0].port_name},<br>${data[0].state}<br>Port Code: ${data[0].port_code}`];
        let parents = [""];
        let values = [0];
        
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

                // Reset iteration to avoid miscounts.
                iter["month"]["id"] = null;
                iter["month"]["index"] = null;
                iter["measure"]["id"] = null;
                iter["measure"]["index"] = null;

            } else {
                values[iter["year"]["index"]] += r.value;
                values[0] += r.value;
            }

            // Month.
            if (r.month != iter["month"]["id"]) {
                iter["month"]["id"] = r.month;

                ids.push(`${iter["year"]["id"]}-${r.month}`);
                labels.push(`${convertMonth(r.month)}`);
                parents.push(`${iter["year"]["id"]}`);

                iter["month"]["index"] = (values.push(r.value) - 1);
                values[0] += r.value;

                // Reset iteratiosn to avoid miscounts.
                iter["measure"]["id"] = null;
                iter["measure"]["index"] = null;
            } else {
                values[iter["month"]["index"]] += r.value;
                values[0] += r.value;
            }

            // Measure.
            if (r.measure != iter["measure"]["id"]) {
                iter["measure"]["id"] = r.measure;

                ids.push(`${iter["year"]["id"]}-${iter["month"]["id"]}-${r.measure}`);
                labels.push(`${formatMeasure(r.measure)}`);
                parents.push(`${iter["year"]["id"]}-${iter["month"]["id"]}`);

                iter["measure"]["index"] = (values.push(r.value) - 1);
                values[0] += r.value;
            } else {
                values[iter["measure"]["index"]] += r.value;
                values[0] += r.value;
            }
        };

        // Modified values to make Sunburst chart use entire circumference.
        let modValues = JSON.parse(JSON.stringify(values));
        modValues[0] = 0;

        // Normalized values for use with colormaps.
        let cValues = values.map(function(num) {
            num = (num - (Math.min.apply(Math, values))) / ((Math.max.apply(Math, values)) - (Math.min.apply(Math, values)));
            return num;
        });

        let sunburstData = [{
            type: "sunburst",
            ids: ids,
            labels: labels,
            parents: parents,
            values: modValues,
            texttemplate: "%{label}",
            insidetextorientation: "horizontal",  
            hovertext: values,
            hovertemplate: "%{label}<br>%{hovertext:,} Crossings<extra></extra>",
            leaf: {opacity: 0.5},
            marker: {
                line: {width: 1},
                autocolorscale: false,
                cmin: 0,
                cmax: 1,
                colors: cValues,
                colorscale: [
                    [0, "#323031"],
                    [0.0005, "#084c61"],
                    [0.005, "#177e89"],
                    [0.025, "#ffc857"],
                    [1, "#ffffff"],
                ],
            },
            branchvalues: "relative",
            sort: false,
            rotation: 0,
            maxdepth: 2,
        }];

        let layout = {
            margin: {l: 5, r: 5, b: 5, t: 5},
            height: 500,
            width: 500,
        };

        Plotly.newPlot(`popup-graph-${row.port_code}`, sunburstData, layout);
    });
}



// Create the Map.
function createMap(data) {
    // Base Layers.
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

    // Data Layer.
    // A layer group for the markers.
    let portLayer = L.layerGroup();

    // Loop through the data and create each marker.
    for (let i = 0; i < data.length; i++) {
        let row = data[i];

        let lat = row.latitude;
        let lng = row.longitude;
        let latlng = [lat, lng];

        let marker = L.circle(latlng, getMarkerOptions(row));

        // Generate a popup for the marker.
        let popup = createPopupHTML(row);
        marker.bindPopup(popup);
        
        // Define event listeners for the marker.
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
                    fillOpacity: 0.75
                });
            },
            // Populate the popup with a Sunburst chart on click.
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

    // Initialize Map.
    let myMap = L.map("map", {
        center: [37.0902, -95.7129],
        zoom: 5,
        layers: [street, portLayer]
    });

    // Layer Control.
    L.control.layers(baseLayers, dataLayers).addTo(myMap);
}

// Initialize.
function init() {
    let url = `/api/v1.0/requestData?group_by=port_code&order_by=port_code:ASC`;

    d3.json(url).then(function(data) {
        createMap(data);
    });
}



// Run it.
init();