# Dependencies.
# Flask.
from flask import Flask, jsonify, render_template, request

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
# API Request for Data.
@app.route("/api/v1.0/requestData")
def requestData():
    # Process the request.
    # Select.
    select = None
    if 'select' in request.args:
        select = list()
        if ',' in request.args['select']:
            select = request.args['select'].split(',')
        else:
            select.append(request.args['select'])

    # Where.
    where = None
    if 'where' in request.args:
        where = list()
        if ',' in request.args['where']:
            where = request.args['where'].split(',')
        else:
            where.append(request.args['where'])

    # Order.
    order = None
    if 'order_by' in request.args:
        order = list()
        if ',' in request.args['order_by']:
            order = [x.split(':') for x in request.args['order_by'].split(',')]
        else:
            order.append(request.args['order_by'].split(':'))

    # Group.
    group = None
    if 'group_by' in request.args:
        group = list()
        if ',' in request.args['group_by']:
            group = request.args['group_by'].split(',')
        else:
            group.append(request.args['group_by'])

    # Limit.
    limit = None
    if 'limit' in request.args:
        try:
            limit = int(request.args['limit'])
        except ValueError as e:
            print(f"{e} occurred while adding limit to query.")

    data = sql.requestData(select = select, where = where, order = order, group = group, limit = limit)

    return data

# ...


# ---------------------------------------------------------------------------------------------------------
# Run the App.
if __name__ == "__main__":
    app.run(debug = True)