function renderFilters(){
    // Donut Chart.
    // port_name
    url = `/api/v1.0/requestData?select=port_name&group_by=port_name&order_by=port_name:ASC`
    d3.json(url).then(function(data) {
        for (i = 0; i < data.length; i++) {
            d3.select("#donut-chart-port_name-filter")
            .append('option')
            .text(`${data[i].port_name}`);
        }
    });

    // state
    url = `/api/v1.0/requestData?select=state&group_by=state&order_by=state:ASC`
    d3.json(url).then(function(data) {
        for (i = 0; i < data.length; i++) {
            d3.select("#donut-chart-state-filter")
            .append('option')
            .text(`${data[i].state}`);
        }
    });

    // port_code
    url = `/api/v1.0/requestData?select=port_code&group_by=port_code&order_by=port_code:ASC`
    d3.json(url).then(function(data) {
        for (i = 0; i < data.length; i++) {
            d3.select("#donut-chart-port_code-filter")
            .append('option')
            .text(`${data[i].port_code}`);
        }
    });

    // month
    url = `/api/v1.0/requestData?select=month&group_by=month&order_by=month:ASC`
    d3.json(url).then(function(data) {
        for (i = 0; i < data.length; i++) {
            d3.select("#donut-chart-month-filter")
            .append('option')
            .text(`${data[i].month}`);

        }
    });

    // year
    url = `/api/v1.0/requestData?select=year&group_by=year&order_by=year:ASC`
    d3.json(url).then(function(data) {
        for (i = 0; i < data.length; i++) {
            d3.select("#donut-chart-year-filter")
            .append('option')
            .text(`${data[i].year}`);
        }
    });
}

function renderDonutChart() {
    d3.json(filterDonutChart()).then(function(data){
        console.log(data);
        let values = [];
        let labels = [];

        for (i = 0; i < data.length; i++) {
            row = data[i];

            values.push(row['value']);
            labels.push(row['measure'].replaceAll(' ', '<br>'));
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
            title: 'Modes of Transportation Across the Border',
            height: 800,
            // width: 600,
            showlegend: false,
            grid: {rows: 1, columns: 1}
        };
        
        d3.select("#donut-chart").html("");
        Plotly.newPlot('donut-chart', donutData, layout);
    });
}

function filterDonutChart() {
    // Build the API request.
    let where = ""
    let w_list = [];

    if (d3.select("#donut-chart-port_name-filter").property("value") != "All") {
        w_list.push(`port_name='${d3.select("#donut-chart-port_name-filter").property("value")}'`);
    }

    if (d3.select("#donut-chart-state-filter").property("value") != "All") {
        w_list.push(`state='${d3.select("#donut-chart-state-filter").property("value")}'`);
    }

    if (d3.select("#donut-chart-port_code-filter").property("value") != "All") {
        w_list.push(`port_code=${d3.select("#donut-chart-port_code-filter").property("value")}`);
    }

    if (d3.select("#donut-chart-month-filter").property("value") != "All") {
        w_list.push(`month=${d3.select("#donut-chart-month-filter").property("value")}`);
    }

    if (d3.select("#donut-chart-year-filter").property("value") != "All") {
        w_list.push(`year=${d3.select("#donut-chart-year-filter").property("value")}`);
    }

    // Check if selections are all 'All'.
    if (w_list != undefined || w_list.length != 0) {
        for (i = 0; i < w_list.length; i++) {
            if (i === 0) {
                where = where + w_list[i];
            } else {
                where = where + ' AND ' + w_list[i];
            }
        }
    }
    
    if (where != "") {
        return `/api/v1.0/requestData?select=measure,SUM(value) AS 'value'&where=${where}&group_by=measure&order_by=value:DESC`;
    }

    return `/api/v1.0/requestData?select=measure,SUM(value) AS 'value'&group_by=measure&order_by=value:DESC`;
}

function init() {
    // have to get all the filters going.
    // render the first look at everything.
    // ... yeah

    // Populate the filters.
    renderFilters();
    renderDonutChart();
    
   
}

d3.select("#donut-chart-filter-button").on("click", renderDonutChart);

init();
// // ... for this we can only have one type of thing...
// // ... i.e., no mixing months or years or transit types



// const myChart = document.querySelector(".donut-chart");
// const ul = document.querySelector(".transportation-stats .details ul");

// new Chart(myChart, {
//     type: "doughnut",
//     data: {
//         labels: chartData.labels,
//         datasets: [
//             {
//                 label: "Transportation Popularity",
//                 data: chartData.data,
//                 backgroundColor: chartData.colors
//             },
//         ],
//     },
//     options: {
//         borderWidth: 10,
//         borderRadius: 2,
//         hoverBorderWidth: 0,
//         plugins: {
//             legend: {
//                 display: false,
//             },
//         },
//     },
// });

// const populateUl = () => {
//     chartData.labels.forEach((l, i) => {
//         let li = document.createElement("li");
//         li.innerHTML = `${l}: <span class='percentage'>${chartData.data[i]}%</span>`;
//         ul.appendChild(li);
//     });
// };

// populateUl();




// Populate Line Chart, Donut Chart, and Table on page load.
// Filters for each can redraw individual elements.

// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <meta http-equiv="X-UA-Compatible" content="ie=edge">
//     <title>Document</title>
//     <link rel="preconnect" href="https://fonts.googleapis.com">
//     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//     <link 
//         href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap" 
//         rel="stylesheet">
//     <link rel="stylesheet" href="style.css">
// </head>
// <body>

//     <h2 class="chart-heading">Transportation Across the Border</h2>
//     <div class="transportation-stats">
//       <div class="chart-container">
//         <canvas class="my-chart"></canvas>
//       </div>

//         <div class="details">
//            <ul></ul> 
//         </div>
//     </div>

//     <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
//     <script src="app.js"></script>
//   </body>
// </html>