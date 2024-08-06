function do_work() {
  // We need to make a request to the API
  let url = "https://api.spacexdata.com/v4/launchpads";
  d3.json(url).then(function (data) {

    // extract user input
    let min_launches = d3.select("#launch_filter").property("value");
    min_launches = parseInt(min_launches);
    let region = d3.select("#region_filter").property("value");

    // Once we have the launches, filter by our user input
    let filtered_data = data.filter(x => x.launch_attempts >= min_launches);

    // if not the All region, apply filter
    if (region !== "All") {
      filtered_data = filtered_data.filter(x => x.region === region);
    }

    // create the graphs
    make_bar(filtered_data);
    make_pie(filtered_data);
    make_table(filtered_data)
  });
}

function make_table(filtered_data) {
  // select table
  let table = d3.select("#data_table");
  let table_body = table.select("tbody");
  table_body.html(""); // destroy any existing rows

  // create table
  for (let i = 0; i < filtered_data.length; i++){
    // get data row
    let data_row = filtered_data[i];

    // creates new row in the table
    let row = table_body.append("tr");
    row.append("td").text(data_row.port_name);
    row.append("td").text(data_row.port_code);
    row.append("td").text(data_row.state);
    row.append("td").text(data_row.latitude);
    row.append("td").text(data_row.longitude);
    row.append("td").text(data_row.value);
    
  }
}

function make_pie(filtered_data) {
  // sort values
  filtered_data.sort((a, b) => (b.launch_attempts - a.launch_attempts));

  // extract data for pie chart
  let pie_data = filtered_data.map(x => x.launch_attempts);
  let pie_labels = filtered_data.map(x => x.name);

  let trace1 = {
    values: pie_data,
    labels: pie_labels,
    type: 'pie',
    hoverinfo: 'label+percent+name',
    hole: 0.4,
    name: "Attempts"
  }

  // Create data array
  let data = [trace1];

  // Apply a title to the layout
  let layout = {
    title: "Modes of Transportation",
  }

  Plotly.newPlot("pie_chart", data, layout);
}

function make_bar(filtered_data) {
  // sort values
  filtered_data.sort((a, b) => (b.launch_attempts - a.launch_attempts));

  // extract the x & y values for our bar chart
  let bar_x = filtered_data.map(x => x.name);
  let bar_text = filtered_data.map(x => x.full_name);
  let bar_y1 = filtered_data.map(x => x.launch_attempts);
  let bar_y2 = filtered_data.map(x => x.launch_successes);

  // Trace1 for Line Graph
  let trace1 = {
    x: bar_x,
    y: bar_y1,
    type: 'bar',
    marker: {
      color: "#084C61"
    },
    text: bar_text,
    name: "TITLE"
  };

  // Trace 2 for Line Graph
  let trace2 = {
    x: bar_x,
    y: bar_y2,
    type: 'bar',
    marker: {
      color: "#FFC857"
    },
    text: bar_text,
    name: "TITLE"
  };

  // Create data array
  let data = [trace1, trace2];

  // Apply a title to the layout
  let layout = {
    title: "LINE CHART TITLE",
    barmode: "group",
    // Include margins in the layout so the x-tick labels display correctly
    margin: {
      l: 50,
      r: 50,
      b: 200,
      t: 50,
      pad: 4
    }
  };

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar_chart", data, layout);

}

// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);

// on page load, don't wait for the click to make the graph, use default
do_work();






