# Dependencies.
# SQL Alchemy.
import sqlalchemy
from sqlalchemy import create_engine, text, func, select, distinct
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

# Other.
import datetime
import pandas as pd
import numpy as np



class SQLQueries():
    def __init__(self):
        self.engine = create_engine("sqlite:///../data/border_database.sqlite")
    
    # Functions.
    def getUniquePorts(self):
        # Get each UNIQUE port for plotting.
        query = """
            SELECT *
            FROM crossings
            GROUP BY port_code
            ORDER BY port_code ASC;
        """

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient = "records")

        return data

    

    def getPopup(self, port_code):
        # Get an ordered list of all information for a port ordered by year, month, and measure.
        query = f"""
            SELECT *
            FROM crossings
            WHERE port_code = {port_code}
            ORDER BY
                year DESC,
                month DESC,
                measure DESC;
        """

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient = "records")

        return data
