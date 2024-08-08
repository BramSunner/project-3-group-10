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
def home():
    return render_template("home.html")

# Dashboard.
@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

# Map.
@app.route("/map")
def map():
    return render_template("map.html")

# About Us.
@app.route("/about_us")
def about():
    return render_template("about_us.html")

# Works Cited.
@app.route("/works_cited")
def works_cited():
    return render_template("works_cited.html")

@app.route("/test")
def test():
    return render_template("test.html")

# SQL Routes.
# ---------------------------------------------------------------------------------------------------------
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

# ...


# ---------------------------------------------------------------------------------------------------------
# Run the App.
if __name__ == "__main__":
    app.run(debug = True)