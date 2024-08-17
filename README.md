# Quick Start  
Visit ethanmbasura.pythonanywhere.com for the full site.  
If you would prefer to run this on your own computer, see the 'how to use' section below.  

# How To Use
Clone the repository.  
Run the app.py file, and click on the link that appears in the terminal to load the site.  

Homepage, About Us, and Works Cited are static information pages. Easy to use.  

Dashboard is an interactive page that loads three visualizations of the dataset given filters.  
You are able to select filters from the menubar to the left and apply them.  
These changes should reflect in the charts shown on the page.  

Map is an interactive page that shows the ports of entry in the U.S.  
Upon zooming in and clicking on a port, it will show summary statistics for that ports border crossings.  

# Project Overview  
This project ingests a dataset from the U.S. Bureau of Transportation regarding border crossing statistics at U.S. ports of entry.  

First, the data is cleaned and transformed and put into a sqlite database titled 'border_crossings.sqlite'.  
Then, we created a backend using flask that will load the pages for the website as well as providing an endpoint for requesting data.  
The endpoint for requesting data serves as an api for the site: all requests for data are handled in the same endpoint.  
Also, we wrote out the HTML for our pages and the accompanying JavaScript for the interactive pages (dashboard and map).  
The pages are as follows:
- Homepage: general information and a quick how to use the site blurb.
- Dashboard: interactive visualizations with user selected filter functionality.
- Map: geographic visualization of all ports of entry in the dataset.
- About Us: introductions to our team members.
- Works Cited: all of the resources used to create the project. 

Our donut chart and linechart were created with Plotly, the table was created with DataTables, and the map was created using Leaflet.

We have hosted the site at ethanmbasura.pythonanywhere.com  
But, phone users beware! It is not handheld device friendly.

# Built In  
Jupyter Notebook.  
Python.  
JavaScript.  
HTML.  
CSS.  

# Resources
U.S. Customs and Border Protection (2024, June 21).On a Typical Day in Fiscal Year 2022, CBP...  
U.S. Customs and Border Protection. Retrieved August 1, 2024, from https://www.cbp.gov/newsroom/stats/typical-day-fy2022  

U.S. Department of Transportation(2024)Border Crossing Entry Data.  
Bureau of Transportation Statistics. Retrieved August 10, 2024, from https://data.bts.gov/Research-and-Statistics/Border-Crossing-Entry-Data/keg4-3bc2/data  

U.S. Department of Transportation (2021, January 12). Border Crossing/Entry Data.  
Bureau of Transportation Statistics. Retrieved August 10, 2024, from https://www.bts.gov/explore-topics-and-geography/geography/border-crossingentry-data#1  

U.S. Department of Transportation (2023, August 23). Transborder Data Mid-Year Report 2023.  
Bureau of Transportation Statistics. Retrieved August 1, 2024, from https://www.bts.gov/data-spotlight/transborder-data-mid-year-report-2023#:~:text=U.S.%20land%20borders%20with%20Canada,trade%20partners%20of%20agricultural%20goods  

Wolfe, J. (2024, June 4).San Diego Is Once Again a Top Migrant Entry Point. The New York Times.  
https://www.nytimes.com/2024/06/04/us/san-diego-migrants-california.html  
