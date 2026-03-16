from mysql.connector import connect, errors
import os

class MysqlConnection:
    def __init__(self, host, port, password, user, database, logger):
        self.host = host
        self.port = port
        self.password = password
        self.user = user
        self.database = database
        self.logger = logger

    def connect(self):
        try:
            self.con = connect(
                host = self.host,
                port = self.port,
                password = self.password,
                user = self.user,
                database = self.database
            )
            self.cursor = self.con.cursor()
            self.logger.info(f"connection with mysql established")
        except errors.Error as e:
            self.logger.error(f"error connecting to mysql: {e}")

    def insert(self, query, data):
        try:
            self.cursor.execute(query, data)
            self.con.commit()
            self.logger.info(f"data: {data} inserted successfully")
        except Exception as e:
            self.logger.error(f"error inserting data: {data} to mysql: {e}")

    def update(self, query):
        try:
            self.cursor.execute(query)
            self.con.commit()
            self.logger.info(f"table updated successfully")
        except Exception as e:
            self.logger.error(f"error updating table: {e}")

    def check_existance(self, entity_id):
        try:
            query = f"""
                SELECT * FROM entities
                WHERE id LIKE {entity_id}
                """
            result = self.cursor.execute(query)
            if result:
                return True
            return False
        except Exception as e:
            self.logger.error(f"error checking existance: {e}")
