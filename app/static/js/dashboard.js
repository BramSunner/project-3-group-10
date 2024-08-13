




// Page initialization.
function setupPage() {
    populateFilterOptions();
    setButtons();
}

// Populate each filter with appropriate data.
function populateFilterOptions(){
    // Port Name.
    url = `/api/v1.0/requestData?select=port_name&group_by=port_name&order_by=port_name:ASC`
    d3.json(url).then(function(data) {
        for (i = 0; i < data.length; i++) {
            d3.select("#filter-port_name")
                .append('option')
                .text(`${data[i].port_name}`);
        }
    });

    // State.
    url = `/api/v1.0/requestData?select=state&group_by=state&order_by=state:ASC`
    d3.json(url).then(function(data) {
        for (i = 0; i < data.length; i++) {
            d3.select("#filter-state")
                .append('option')
                .text(`${data[i].state}`);
        }
    });

    // Port Code.
    url = `/api/v1.0/requestData?select=port_code&group_by=port_code&order_by=port_code:ASC`
    d3.json(url).then(function(data) {
        for (i = 0; i < data.length; i++) {
            d3.select("#filter-port_code")
                .append('option')
                .text(`${data[i].port_code}`);
        }
    });

    // Border.
    url = `/api/v1.0/requestData?select=border&group_by=border&order_by=border:ASC`
    d3.json(url).then(function(data) {
        for (i = 0; i < data.length; i++) {
            d3.select("#filter-border")
                .append('option')
                .text(`${data[i].border}`);
        }
    });

    // Measure.
    url = `/api/v1.0/requestData?select=measure&group_by=measure&order_by=measure:ASC`
    d3.json(url).then(function(data) {
        for (i = 0; i < data.length; i++) {
            d3.select("#filter-measure")
                .append('option')
                .text(`${data[i].measure}`);
        }
    });

    // Month.
    url = `/api/v1.0/requestData?select=month&group_by=month&order_by=month:ASC`
    d3.json(url).then(function(data) {
        for (i = 0; i < data.length; i++) {
            d3.select("#filter-month-1")
                .append('option')
                .text(`${data[i].month}`);

            d3.select("#filter-month-2")
                .append('option')
                .text(`${data[i].month}`);
        }
    });

    // Year.
    url = `/api/v1.0/requestData?select=year&group_by=year&order_by=year:ASC`
    d3.json(url).then(function(data) {
        for (i = 0; i < data.length; i++) {
            d3.select("#filter-year-1")
                .append('option')
                .text(`${data[i].year}`);

            d3.select("#filter-year-2")
                .append('option')
                .text(`${data[i].year}`);
        }
    });
}

// Link button events to JS functions.
function setButtons() {
    d3.select("#btn-line-re")
        .on("click", updateLineChart)
        .on("mouseover", event => event.target.style.backgroundColor = "white")
        .on("mouseout", event => event.target.style.backgroundColor = "transparent");

    d3.select("#btn-donut-re")
        .on("click", updateDonutChart)
        .on("mouseover", event => event.target.style.backgroundColor = "white")
        .on("mouseout", event => event.target.style.backgroundColor = "transparent");

    d3.select("#btn-table-re")
        .on("click", updateTable)
        .on("mouseover", event => event.target.style.backgroundColor = "white")
        .on("mouseout", event => event.target.style.backgroundColor = "transparent");

    d3.select("#filter-button")
        .on("click", updateAll);

    // Group Buttons.
    // Note: commented out because the functionality didn't work as intended.
    // But... didn't want to get rid of the code. To see if I could make it work later.
    // Set value to "false".
    // d3.selectAll(".btn-grp")
    //     .property("value", false);

    // Handle further interaction.
    // d3.selectAll(".btn-grp")
    // .on("click", function(event) {
    //     if (event.target.value === "true") {
    //         event.target.value = false;
    //         event.target.style.backgroundColor = "#ffffff";
    //         event.target.style.color = "#000000";
    //     } else if (event.target.value === "false") {
    //         event.target.value = true;
    //         event.target.style.backgroundColor = "#177e89";
    //         event.target.style.color = "#ffffff";
    //     }
    // })
    // .on("mouseover", event => event.target.style.borderColor = "#ffc857")
    // .on("mouseout", event => event.target.style.borderColor = "#ffffff");

    // Order Buttons.
    // Set value to "false".
    d3.selectAll(".btn-filter")
        .property("value", false);

    // Handle further interaction.
    d3.selectAll(".btn-filter")
    .on("click", function(event) {
        let id = event.target.id.split('-');
        
        if (event.target.value === "true") {
            event.target.value = false;
            event.target.style.backgroundColor = "#ffffff";
            event.target.style.color = "#000000";
        } else if (event.target.value === "false") {
            event.target.value = true;
            event.target.style.backgroundColor = "#177e89";
            event.target.style.color = "#ffffff";
        }

        d3.select(`#btn-${id[1]}-${((id[2] === "asc") ? "desc" : "asc")}`)
            .property("value", false)
            .style("background", "#ffffff")
            .style("color", "#000000");
    })
    .on("mouseover", event => event.target.style.borderColor = "#ffc857")
    .on("mouseout", event => event.target.style.borderColor = "#000000");
}

// Handle API Request for each visualization.
function filterData(type = "none") {
    // Variable to hold clauses.
    let clauses = [];

    // Where.
    // Get all 'where' options.
    let w_list = [];
    let w_sel = d3.selectAll(".filter-sel")["_groups"][0];
    for (let i = 0; i < w_sel.length; i++) {
        // Is this filter unused?
        if ((w_sel[i]["value"] != "All") && (w_sel[i]["value"] != "")) {
            let id = w_sel[i]["id"].split('-');
            
            // Special case for String select.
            if (["port_name", "state", "border", "measure"].some(param => id.includes(param))) {
                if ((type === "donut") && (id.includes("measure"))) {} 
                else {
                    w_list.push(
                        `${id[1]}` +
                        `=` + 
                        `'${w_sel[i]["value"]}'`
                    );
                }
            }
            // Special case for Month & Year.
            else if (["month", "year"].some(param => id.includes(param))) {
                w_list.push(
                    `${id[1]}` +
                    `${d3.select(`#filter-${id[1]}-cmp-${id[2]}`).property("value")}` +
                    `${w_sel[i]["value"]}`
                );
            }
            // Special case for numeric input.
            else if (["value", "latitude", "longitude"].some(param => id.includes(param))) {
                if (d3.select(`#filter-${id[1]}-${id[3]}`).property("value") != "") {
                // Special case for negative numbers.
                    if (d3.select(`#filter-${id[1]}-${id[3]}`).property("value").includes("-")) {
                        w_list.push(
                            `CAST(REPLACE(REPLACE(${id[1]}, '(', '-'), ')', '') AS DECIMAL(10,2))` +
                            `${w_sel[i]["value"]}` +
                            `${d3.select(`#filter-${id[1]}-${id[3]}`).property("value")}`
                        );
                    // Regular case. 
                    } else {
                        w_list.push(
                            `${id[1]}` +
                            `${w_sel[i]["value"]}` +
                            `${d3.select(`#filter-${id[1]}-${id[3]}`).property("value")}`
                        );
                    }
                }
            }
            // Regular case for numeric select.
            else {
                w_list.push(
                    `${id[1]}` +
                    `=` + 
                    `${w_sel[i]["value"]}`
                );
            }
        }
    }

    // Construct 'where' clause.
    if (w_list != undefined && w_list.length != 0) {
        clauses.push("where");
        let where = "";

        for (let i = 0; i < w_list.length; i++) {
            if (i === 0) {
                where = where + w_list[i];
            } else {
                where = where + ' AND ' + w_list[i];
            }
        }

        clauses.push(where);
    }
    
    // Group.
    // Note: commented out because the functionality didn't work as intended.
    // But... didn't want to get rid of the code. To see if I could make it work later.
    // let g_list = [];
    // let g_btns = d3.selectAll(".btn-grp")["_groups"][0];
    // for (let i = 0; i < g_btns.length; i++) {
    //     if (g_btns[i]["value"] === "true") {
    //         g_list.push(g_btns[i]["id"].split('-')[1]);
    //     }
    // }

    // if (g_list != undefined && g_list.length != 0) {
    //     clauses.push("group_by");
    //     let group = "";

    //     for (let i = 0; i < g_list.length; i++) {
    //         if (i === 0) {
    //             group = group + g_list[i];
    //         } else {
    //             group = group + ',' + g_list[i];
    //         }
    //     }

    //     clauses.push(group);
    // }

    // Order.
    // Get all 'order' options.
    let o_list = [];
    let o_btns = d3.selectAll(".btn-filter")["_groups"][0];
    for (let i = 0; i < o_btns.length; i++) {
        if (o_btns[i]["value"] === "true") {
            o_list.push(
                `${o_btns[i]["id"].split('-')[1]}:` +
                `${o_btns[i]["id"].split('-')[2]}`
            );
        }
    }

    // Construct 'order' clause.
    if (o_list != undefined && o_list.length != 0) {
        clauses.push("order_by");
        let order = "";

        for (let i = 0; i < o_list.length; i++) {
            if (i === 0) {
                order = order + o_list[i];
            } else {
                order = order + ',' + o_list[i];
            }
        }

        clauses.push(order);
    }
    
    // Add Line Chart in. ************************************************************************************************ <-------------------------------------------
    if (type === "line") {
        if ((clauses != undefined) && (clauses.length != 0)) {
            let phrase = "";
            for (let i = 0; i < clauses.length; i+=2) {
                if (clauses[i] === "where") {
                    phrase += `&${clauses[i]}=${clauses[i+1]}`;
                }
            }

            return `/api/v1.0/requestData` +
                `?select=measure,value,month` +
                phrase;
        } else {
            return `/api/v1.0/requestData` +
                `?select=measure,value,month`;
        }
    }

    if (type === "donut") {
        if ((clauses != undefined) && (clauses.length != 0)) {
            let phrase = "";
            for (let i = 0; i < clauses.length; i+=2) {
                if (clauses[i] === "where") {
                    phrase += `&${clauses[i]}=${clauses[i+1]}`;
                }
            }

            return `/api/v1.0/requestData` +
                `?select=measure,SUM(value) AS 'value'` +
                `&group_by=measure` + 
                `&order_by=value:DESC` +
                phrase;
        } else {
            return `/api/v1.0/requestData` +
                `?select=measure,SUM(value) AS 'value'` +
                `&group_by=measure` + 
                `&order_by=value:DESC`;
        }
    }

    if (type === "table") {
        if ((clauses != undefined) && (clauses.length != 0)) {
            let phrase = "";
            for (let i = 0; i < clauses.length; i+=2) {
                phrase += `&${clauses[i]}=${clauses[i+1]}`;
            }

            return `/api/v1.0/requestData` +
                `?limit=10000` +
                phrase;
        } else {
            return `/api/v1.0/requestData` +
                `?limit=10000`;
        }
    }

    return `/api/v1.0/requestData`;
}

function renderLineChart(data) {
    console.log("Render the line chart.");
    let bus_passengers = [];
    let buses = [];
    let pedestrians = [];
    let personal_vehicle_passengers = [];
    let personal_vehicles = [];
    let rail_containers_empty = [];
    let rail_containers_loaded =[];
    let train_passengers = [];
    let trains = [];
    let truck_containers_empty = [];
    let truck_containers_loaded = [];
    let trucks = [];
    
    for (i = 0; i < data.length; i++) {
        row = data[i];
        months = [1,2,3,4,5,6,7,8,9,10,11,12];
        if (row['measure'] === 'Bus Passengers') {
            bus_passengers.push(row['value']);
        }
        else if (row['measure'] === 'Buses'){
            buses.push(row['value']);
        }
        else if (row['measure'] === 'Pedestrians') {
            pedestrians.push(row['value']);
        }
        else if (row['measure'] === 'Personal Vehicle Passengers'){
            personal_vehicle_passengers.push(row['value']);
        }
        else if (row['measure'] === 'Personal Vehicles') {
            personal_vehicles.push(row['value']);
        }
        else if (row['measure'] === 'Rail Containers Empty') {
            rail_containers_empty.push(row['value']);
        }
        else if (row['measure'] === 'Rail Containers Loaded'){
            rail_containers_loaded.push(row['value']);
        }
        else if (row['measure'] === 'Train Passengers') {
            train_passengers.push(row['value']);
        }
        else if (row['measure'] === 'Trains') {
            trains.push(row['value']);
        }
        else if (row['measure'] === 'Truck Containers Emptys') {
            truck_containers_empty.push(row['value']);
        }
        else if (row['measure'] === 'Truck Containers Loaded') {
            truck_containers_loaded.push(row['value']);
        }
        else {
            trucks.push(row['value']);
        }
    }
    let tr1 = {
        x: months,
        y: bus_passengers,
        mode:'line',
        line : {color:"#323031", width: 2},
        name : 'Bus Passengers'
    }
    let tr2 = {
        x: months,
        y: buses,
        mode:'line',
        line : {color:"#084c61", width: 2},
        name : 'Buses'
    }  
    let tr3 = {
        x: months,
        y: pedestrians,
        mode:'line',
        line : {color:"#177e89", width: 2},
        name : 'Pedestrians'
    }  
    let tr4 = {
        x: months,
        y: personal_vehicle_passengers,
        mode:'line',
        line : {color:"#ffc857", width: 2},
        name : 'Personal Vehicle Passengers'
    }  
    let tr5 = {
        x: months,
        y: personal_vehicles,
        mode:'line',
        line : {color:"#db3a34", width: 2},
        name : 'Personal Vehicles'
    }  
    let tr6 = {
        x: months,
        y: rail_containers_empty,
        mode:'line',
        line : {color:"#323031", width: 2},
        name : 'Rail Containers Empty'
    }  
    let tr7 = {
        x: months,
        y: rail_containers_loaded,
        mode:'line',
        line : {color:"#084c61", width: 2},
        name : 'Rail Containers Loaded'
    }  
    let tr8 = {
        x: months,
        y: train_passengers,
        mode:'line',
        line : {color:"#177e89", width: 2},
        name : 'Train Passengers'
    }  
    let tr9 = {
        x: months,
        y: trains,
        mode:'line',
        line : {color:"#ffc857", width: 2},
        name : 'Trains'
    }  
    let tr10 = {
        x: months,
        y: truck_containers_empty,
        mode:'line',
        line : {color:"#db3a34", width: 2},
        name : 'Truck Containers Empty'
    }  
    let tr11 = {
        x: months,
        y: truck_containers_loaded,
        mode:'line',
        line : {color:"#084c61", width: 2},
        name : 'Truck Containers Loaded'
    }  
    let tr12 = {
        x: months,
        y: trucks,
        mode:'line',
        line : {color:"#177e89", width: 2},
        name : 'Trucks'
    }  
    line_data = [tr1,tr2,tr3,tr4,tr5,tr6,tr7,tr8,tr9,tr10,tr11,tr12]
    
    let layout = {
        title: '',
        height: 1000,
        xaxis: {title: 'Month'},
        // yaxis: {title: 'Count'}
    };

    Plotly.newPlot('line-chart', line_data, layout);
}

function renderDonutChart(data) {
    let values = [];
    let labels = [];

    for (i = 0; i < data.length; i++) {
        row = data[i];

        if (row['value'] != 0) {
            values.push(row['value']);
            labels.push(row['measure'].replaceAll(' ', '<br>'));
        }
    }

    let donutData = [{
        values: values,
        labels: labels,
        domain: {row: 0, column: 0},
        name: 'Transport<br>Types',
        hoverinfo: 'label+percent+value+name',
        hole: .5,
        type: 'pie',
        marker: {
            colors: [
                "#323031", 
                "#084c61", 
                "#177e89", 
                "#ffc857",
                "#db3a34", 
                "#323031", 
                "#084c61", 
                "#177e89", 
                "#ffc857",
                "#db3a34",
                "#323031", 
                "#084c61"
            ],
            line: {
                color: "#ffffff",
                width: 1,
            },
        },
    }];
    
    let layout = {
        title: '',
        height: 1000,
        showlegend: false,
        grid: {rows: 1, columns: 1}
    };
    
    d3.select("#donut-chart").html(""); // Delete old visualization.
    Plotly.newPlot('donut-chart', donutData, layout);
}

// Table Visualization.
function renderTable(data) {
    // Clear previous information.
    $('#table').DataTable().clear().destroy();
    let body = d3.select("#table-body").html("");

    for (i = 0; i < data.length; i++) {
        row = data[i];

        let tr = body.append("tr")
            .attr("class", "table-light");

        tr.append("td").text(i);
        tr.append("td").text(row["port_name"]);
        tr.append("td").text(row["state"]);
        tr.append("td").text(row["port_code"]);
        tr.append("td").text(row["border"]);
        tr.append("td").text(row["measure"]);
        tr.append("td").text(row["value"]);
        tr.append("td").text(row["month"]);
        tr.append("td").text(row["year"]);
        tr.append("td").text(row["latitude"]);
        tr.append("td").text(row["longitude"]);
    }

    // DataTable.
    $('#table').DataTable();
}

// Update Visualizations.
// Calls filterData for API request.
// Renders visualiation using that data.
function updateAll() {
    updateLineChart();
    updateDonutChart();
    updateTable();
}
function updateLineChart() {
    d3.json(filterData(type = "line")).then(data => renderLineChart(data));
}

function updateDonutChart() {
    d3.json(filterData(type = "donut")).then(data => renderDonutChart(data));
}

function updateTable() {
    d3.json(filterData(type = "table")).then(data => renderTable(data));
}

// Initialize the page.
// Setup all buttons and filters.
// Render all visualizations with default filter settings.
function init() {
    setupPage();
    updateLineChart();
    updateDonutChart();
    updateTable();
}

init();