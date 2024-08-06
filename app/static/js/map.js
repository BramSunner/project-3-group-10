



// Helper Functions.

// Generate Popup HTML.
function makePopupHTML(row) {
    // I apologize because this is about to look a little gross.
    // But it works.
    
    // Generate the HTML code for the popup.
    let text = 
        `<div id="popup-${row.port_code}">` + 
            `<div id="popup-info-${row.port_code}">` +
                `<h3>${row.port_name}, ${row.state} | Code: ${row.port_code}</h3>` + 
            '</div' +
            '<hr>' +
            `<div id="popup-filter-${row.port_code}">` +
                '<select id="sel-year-1">' +
                    '<option selected>All</option>' +
                    '<option>2024</option>' +
                    '<option>2023</option>' +
                    '<option>2022</option>' +
                    '<option>2021</option>' +
                    '<option>2020</option>' +
                    '<option>2019</option>' +
                    '<option>2018</option>' +
                    '<option>2017</option>' +
                    '<option>2016</option>' +
                    '<option>2015</option>' +
                    '<option>2014</option>' +
                '</select>' +
                '<select id="sel-month-1">' +
                    '<option selected>All</option>' +
                    '<option>Jan</option>' +
                    '<option>Feb</option>' +
                    '<option>Mar</option>' +
                    '<option>Apr</option>' +
                    '<option>May</option>' +
                    '<option>Jun</option>' +
                    '<option>Jul</option>' +
                    '<option>Aug</option>' +
                    '<option>Sep</option>' +
                    '<option>Oct</option>' +
                    '<option>Nov</option>' +
                    '<option>Dec</option>' +
                '</select>' +
                '<p> to </p>' + 
                '<select id="sel-year-2">' +
                    '<option selected>All</option>' +
                    '<option>2024</option>' +
                    '<option>2023</option>' +
                    '<option>2022</option>' +
                    '<option>2021</option>' +
                    '<option>2020</option>' +
                    '<option>2019</option>' +
                    '<option>2018</option>' +
                    '<option>2017</option>' +
                    '<option>2016</option>' +
                    '<option>2015</option>' +
                    '<option>2014</option>' +
                '</select>' +
                '<select id="sel-month-2">' +
                    '<option selected>All</option>' +
                    '<option>Jan</option>' +
                    '<option>Feb</option>' +
                    '<option>Mar</option>' +
                    '<option>Apr</option>' +
                    '<option>May</option>' +
                    '<option>Jun</option>' +
                    '<option>Jul</option>' +
                    '<option>Aug</option>' +
                    '<option>Sep</option>' +
                    '<option>Oct</option>' +
                    '<option>Nov</option>' +
                    '<option>Dec</option>' +
                '</select>' +
                `<button id="${row.port_code}">Filter</button>` +
            '</div' +
            `<div id="popup-graph-${row.port_code}"></div>` + 
        '</div';
}


function getSunburstData(row) {
    // Make a call for the actual data from the api.
    let data = []; // ... but use the function instead. or maybe not a function.. it's not that much code man and it's norepeating

    // Declare a variable to store items while looking.
    let iter = {
        "port": row.port_code,
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

    let ids = [`${row.port_code}`];
    let labels = [`${row.port_name}, ${row.state}<br>${row.port_code}`];
    let parents = [""];
    let values = [0]; // Should this be made after the fact? Let's find out.

    // Loop thru the data.
    for (let i = 0; i < data.length; i++) {
        let r = data[i];

        // Is this a 'new' year?
        if (r.year != iter["year"]["id"]) {
            iter["year"]["id"] = r.year;

            ids.push(`${r.year}`);
            labels.push(`${r.year}`);
            parents.push(`${iter["port"]}`);

            iter["year"]["index"] = (values.push(r.value) - 1);
        } else {
            values[iter["year"]["index"]] += r.value;
        }

        // Is this a 'new' month?
        if (r.month != iter["month"]["id"]) {
            iter["month"]["id"] = r.month;

            ids.push(`${iter["year"]["id"]}-${r.month}`);
            labels.push(`${r.month}`);
            parents.push(`${iter["year"]["id"]}`);

            iter["month"]["index"] = (values.push(r.value) - 1);
        } else {
            values[iter["month"]["index"]] += r.value;
        }

        // Is this a 'new' measure?
        if (r.measure != iter["measure"]["id"]) {
            iter["measure"]["id"] = r.measure;

            ids.push(`${iter["year"]["id"]}-${iter["month"]["id"]}-${r.measure}`);
            labels.push(`${r.measure}`);
            parents.push(`${iter["year"]["id"]}-${iter["month"]["id"]}`);

            iter["measure"]["index"] = (values.push(r.value) - 1);
        } else {
            values[iter["measure"]["index"]] += r.value;
        }

    };

    return {
        "ids": ids,
        "labels": labels,
        "parents": parents,
        "values": values
    };
}

function makePopupGraph(row) {
    // ... Get data.
    // ... external function... again?

    // Make the trace.
    // Make the graph data.
    // Make the graph layout.
    // Create the plot.
    // This sounds like an external function to me!

    let varName = getSunburstData(row);

    let data = [{
        "type": "sunburst",
        "ids": [], // This should be... inside text, each year, each month for each year, each transport type for each month for each year
        "labels": [], // ^
        "parents": [], // ^ but up one level.
        "values": [],
        "leaf": { "opacity": .5 },
        "marker": { "line": { "width": 2 }},
        "branchvalues": 'total'
    }];

    let layout = {
        "margin": {
            "l": 0,
            "r": 0,
            "b": 0,
            "t": 0
        }
    }

    return
}

// SAMPLE SUNBURST CHART from Plotly docs
// var data = [{
//     type: "sunburst",
//     ids: [
//       "North America", "Europe", "Australia", "North America - Football", "Soccer",
//       "North America - Rugby", "Europe - Football", "Rugby",
//       "Europe - American Football","Australia - Football", "Association",
//       "Australian Rules", "Autstralia - American Football", "Australia - Rugby",
//       "Rugby League", "Rugby Union"
//     ],
//     labels: [
//       "North<br>America", "Europe", "Australia", "Football", "Soccer", "Rugby",
//       "Football", "Rugby", "American<br>Football", "Football", "Association",
//       "Australian<br>Rules", "American<br>Football", "Rugby", "Rugby<br>League",
//       "Rugby<br>Union"
//     ],
//     parents: [
//       "", "", "", "North America", "North America", "North America", "Europe",
//       "Europe", "Europe","Australia", "Australia - Football", "Australia - Football",
//       "Australia - Football", "Australia - Football", "Australia - Rugby",
//       "Australia - Rugby"
//     ],
//     outsidetextfont: {size: 20, color: "#377eb8"},
//     // leaf: {opacity: 0.4},
//     marker: {line: {width: 2}},
//   }];
  
//   var layout = {
//     margin: {l: 0, r: 0, b: 0, t:0},
//     sunburstcolorway:["#636efa","#ef553b","#00cc96"],
//   };
  
  
//   Plotly.newPlot('myDiv', data, layout);




// Main Functions.

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
    // ...
    // Initially, we just need each port of entry coords to make the markers for them.
    // however, it seems relevant to have the port code associated with that port attached to the marker somehow.
    // this would mean grab the coords of each one... but then... how make grab data.
    // when popup stuff is clicked, makes a request

    // Create a layer group for the markers.
    let portLayer = L.layerGroup();

    // Loop thru the data and create each point.
    for (let i = 0; i < data.length; i++) {
        // Isolate the row.
        let row = data[i];

        // Grab the coordinates and make a point.
        let lat = row.latitude;
        let lng = row.longitude;
        let point = [lat, lng];

        // Make a marker.
        let marker = L.marker(point);

        // Make the popup for the marker.
        let popup = makePopupHTML(row);
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

                // ... Get data.
                // Make the trace.
                // Make the graph data.
                // Make the graph layout.
                // Create the plot.
                // This sounds like an external function to me!
                makePopupGraph();

                // Note: filter button listener needs to be added.
                // Note: need to destroy HTML in the graph area because multiple could be rendered in the space over time.
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
    // Grab the data.
    // Make the map.
}