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
    d3.select("#btn-line-re").on("click", updateLineChart);
    d3.select("#btn-donut-re").on("click", updateDonutChart);
    d3.select("#btn-table-re").on("click", updateTable);
    d3.select("#filter-button").on("click", updateAll);
}

// Dynamic coloring for Line Chart.
function chooseAColor(index) {
    colors = ["#ffc857", "#323031", "#084c61", "#db3a34", "#177e89"];
    while (index > 5) { index -= 5; }
    return colors[index];
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
    
    // Line Chart.
    if (type === "line") {
        if ((clauses != undefined) && (clauses.length != 0)) {
            let phrase = "";
            for (let i = 0; i < clauses.length; i+=2) {
                if (clauses[i] === "where") {
                    phrase += `&${clauses[i]}=${clauses[i+1]}`;
                }
            }

            return `/api/v1.0/requestData` +
                `?select=measure,value,month,year,port_code,port_name,state` +
                `&order_by=year:ASC,month:ASC,port_code:DESC,measure:DESC` +
                phrase;
        } else {
            return `/api/v1.0/requestData` +
                `?select=measure,value,month,year,port_code,port_name,state` +
                `&order_by=year:ASC,month:ASC,port_code:DESC,measure:DESC`;
        }
    }

    // Donut Chart.
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

    // Table.
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

// Line Chart Visualization.
function renderLineChart(data) {
    // Find Range of chart.
    let range = [];

    // Only 1 Year.
    if ((data[data.length-1].year - data[0].year) === 0) {
        for (let m = data[0].month; m < (data[data.length-1].month + 1); m++) {
            range.push(`${data[0].year}-${m}-1`);
        }
    }
    // Only 2 Years.
    else if ((data[data.length-1].year - data[0].year) === 1) {
        for (let m = data[0].month; m < 13; m++) {
            range.push(`${data[0].year}-${m}-1`);
        }

        for (let m = 1; (m < data[data.length-1].month + 1); m++) {
            range.push(`${data[data.length-1].year}-${m}-1`);
        }
    }
    // More than 2 Years.
    else {
        // First Year. 
        for (let m = data[0].month; m < 13; m++) {
            range.push(`${data[0].year}-${m}-1`);
        }

        // Middle Year(s).
        for (let y = (data[0].year + 1); y < data[data.length-1].year; y++) {
            for (let m = 1; m < 13; m++) {
                range.push(`${y}-${m}-1`)
            }
        }

        // Last Year.
        for (let m = 1; m < (data[data.length-1].month + 1); m++) {
            range.push(`${data[data.length-1].year}-${m}-1`);
        }
    }

    // Get Data.
    let lineData = [];
    let seenPort = [];
    let seenMeasure = [];
    let groupByPort = d3.select('#filter-line-port_code').property("checked");
    // Loop through data.
    for (let i = 0; i < data.length; i++) {
        row = data[i];

        // Grouping Port. 
        if (groupByPort) {
            // Line Data has something in it.
            if ((seenPort != undefined) && (seenPort.length > 0)) {
                // Port has been created prior.
                if (seenPort.includes(row.port_code)) {
                    lineData[seenPort.indexOf(row.port_code)].y[range.indexOf(`${row.year}-${row.month}-1`)] = row.value;
                } 
                // Port has not been seen yet.
                else {
                    // Create new trace.
                    seenPort.push(row.port_code);
                    lineData.push({
                        x: range,
                        y: new Array(range.length).fill(0),
                        mode: 'line',
                        line: {
                            color: chooseAColor(seenPort.indexOf(row.port_code)), // Figure out dynamic coloring.
                            width: 2,
                        },
                        name: `${row.port_code}`,
                        showlegend: true,
                    });

                    lineData[seenPort.indexOf(row.port_code)].y[range.indexOf(`${row.year}-${row.month}-1`)] = row.value;
                }
            } 
            // Line Data has nothing in it.
            else {
                // Create new trace.
                seenPort.push(row.port_code);
                lineData.push({
                    x: range,
                    y: new Array(range.length).fill(0),
                    mode: 'line',
                    line: {
                        color: chooseAColor(seenPort.indexOf(row.port_code)), // Figure out dynamic coloring.
                        width: 2,
                    },
                    name: `${row.port_code}`,
                    showlegend: true,
                });

                lineData[seenPort.indexOf(row.port_code)].y[range.indexOf(`${row.year}-${row.month}-1`)] = row.value;
            }
        }

        // Grouping Measure.
        else {
            // Line Data has something in it.
            if ((seenMeasure != undefined) && (seenMeasure.length > 0)) {
                // Port has been created prior.
                if (seenMeasure.includes(row.measure)) {
                    lineData[seenMeasure.indexOf(row.measure)].y[range.indexOf(`${row.year}-${row.month}-1`)] = row.value;
                } 
                // Port has not been seen yet.
                else {
                    // Create new trace.
                    seenMeasure.push(row.measure);
                    lineData.push({
                        x: range,
                        y: new Array(range.length).fill(0),
                        mode: 'line',
                        line: {
                            color: chooseAColor(seenMeasure.indexOf(row.measure)), // Figure out dynamic coloring.
                            width: 2,
                        },
                        name: row.measure.split(' ').join('<br>'),
                        showlegend: true,
                    });

                    lineData[seenMeasure.indexOf(row.measure)].y[range.indexOf(`${row.year}-${row.month}-1`)] = row.value;
                }
            } 
            // Line Data has nothing in it.
            else {
                // Create new trace.
                seenMeasure.push(row.measure);
                lineData.push({
                    x: range,
                    y: new Array(range.length).fill(0),
                    mode: 'line',
                    line: {
                        color: chooseAColor(seenMeasure.indexOf(row.measure)), // Figure out dynamic coloring. 
                        width: 2,
                    },
                    name: row.measure.split(' ').join('<br>'),
                    showlegend: true,
                });

                lineData[seenMeasure.indexOf(row.measure)].y[range.indexOf(`${row.year}-${row.month}-1`)] = row.value;
            }          
        }
    }

    let layout = {
        title: '',
        height: 1000,
        xaxis: {
            title: 'Date (Year, Month)'
        },
        yaxis: {
            title: 'Count'
        },
    };

    Plotly.newPlot('line-chart', lineData, layout);
}

// Donut Chart Visualization.
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