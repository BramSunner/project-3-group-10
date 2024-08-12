




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
    if (type === "line") {}

    if (type === "donut") {
        if ((clauses != undefined) && (clauses.length != 0)) {
            let phrase = "";
            console.log("CLAUSES");
            console.log(clauses);
            for (let i = 0; i < clauses.length; i+=2) {
                if (clauses[i] === "where") {
                    phrase += `&${clauses[i]}=${clauses[i+1]}`;
                }
            }

            console.log("DONUT");
            console.log(phrase);

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

            console.log("TABLE");
            console.log(phrase);

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
        height: 800,
        showlegend: false,
        grid: {rows: 1, columns: 1}
    };
    
    d3.select("#donut-chart").html(""); // Delete old visualization.
    Plotly.newPlot('donut-chart', donutData, layout);
}

// Table Visualization.
function renderTable(data) {
    let body = d3.select("#table-body").html("");

    for (i = 0; i < data.length; i++) {
        row = data[i];

        let tr = body.append("tr")
            .attr("class", (((i % 2) === 0) ? "table-active" : "table-secondary"));

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

    // DataTables.
    let table = new DataTable('#table', {
        // option
    });
}

// Update Visualizations.
// Calls filterData for API request.
// Renders visualiation using that data.
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