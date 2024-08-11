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
        self.engine = create_engine(f"sqlite:///border_database.sqlite")
    
    # Functions.
    # API Request.
    def requestData(
            self, 
            select = None, 
            where = None, 
            order = None, 
            group = None,
            limit = None):  
        
        # Base.
        q = ""

        # Select.
        if select != None:
            q_select = "SELECT "
            for n, i in enumerate(select):
                if n == 0:
                    q_select += f"{i}"
                else:
                    q_select += f", {i}"

            q_select += " FROM crossings"
            q += q_select

        else:
            q += "SELECT * FROM crossings"

        # Where.
        if where != None:
            q_where = " WHERE "
            for n, i in enumerate(where):

                if n == 0:
                    q_where += f"{i}"
                else:
                    q_where += f", {i}"

            q += q_where

        # Group.
        if group != None:
            q_group = " GROUP BY "
            for n, i in enumerate(group):
                if n == 0:
                    q_group += f"{i}"
                else:
                    q_group += f", {i}"

            q += q_group

        # Order.
        if order != None:
            q_order = " ORDER BY "
            for n, i in enumerate(order):
                if n == 0:
                    q_order += f"{i[0]} {i[1]}"
                else:
                    q_order += f", {i[0]} {i[1]}"

            q += q_order

        # Limit.
        if limit != None:
            q += f" LIMIT {limit}"

        # Finish the request.
        q += ";"

        print(q)

        # Make the request.
        df = pd.read_sql(text(q), con = self.engine)
        data = df.to_dict(orient = "records")

        return data