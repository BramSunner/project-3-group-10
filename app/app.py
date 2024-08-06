# Dependencies.
# Flask.
from flask import Flask, jsonify, render_template

# Other.
# ...

# Helper Class.
from sqlQueries import SQLQueries



# ---------------------------------------------------------------------------------------------------------
# Setup Flask.
app = Flask(__name__)

# Setup SQL Queries object.
sql = SQLQueries()



# Flask Routes.
# HTML Routes.
# ---------------------------------------------------------------------------------------------------------
# Index/Home.
@app.route("/")
def index():
    return render_template("index.html")

# Dashboard.
@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

# Map.
@app.route("/map")
def map():
    return render_template("map.html")

# About Us.
@app.route("/about-us")
def about():
    return render_template("about-us.html")



# SQL Routes.
# ---------------------------------------------------------------------------------------------------------
# ... What do we need?
# In the map, we will want to filter out the data for a specific port of entry.
# This data could potentially be filtered by ... year, month, type, ... 
# ok so it would filter out the port code
# then sort by year, month, transport type.

# Populate the Map.
@app.route("/api/v1.0/populate_map")
def populateMap():
    map_data = sql.getUniquePorts()
    return jsonify(map_data)

# Populate a Popup.
@app.route("/api/v1.0/populate_popup/<port_code>")
def populatePopup(port_code):
    popup_data = sql.getPopup(int(port_code)) # Port Code must be casted to INT for this to work.
    return jsonify(popup_data)



# ---------------------------------------------------------------------------------------------------------
# Run the App.
if __name__ == "__main__":
    app.run(debug = True)