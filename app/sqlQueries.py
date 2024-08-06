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
        self.engine = create_engine("sqlite:///border_database.sqlite")

        def init_base(self):
            self.Base = automap_base()
            self.Base.prepare(autoload_with = self.engine)
    
    # Functions.
    def getUniquePorts(self):
        session = Session(self.engine)
        Crossings = self.Base.classes.crossings

        df = pd.read_sql(
            session.query(Crossings).group_by(Crossings.port_code).all(),
            con = self.engine)
        
        data = df.to_dict(orient = "records")
        
        # Close the session.
        session.close()

        return data
    
    def getPopup(self, port_code):
        session = Session(self.engine)
        Crossings = self.Base.classes.crossings

        df = pd.read_sql(
            session.query(Crossings).filter(Crossings.port_code == port_code).all(),
            con = self.engine)
        
        data = df.to_dict(orient = "records")

        # Close the session.
        session.close()

        return data