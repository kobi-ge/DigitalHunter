import logging
import os

from mysql_connection import MysqlConnection
from utils import tables_query

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

mysql = MysqlConnection(
    host=os.getenv("MYSQL_HOST"),
    port=int(os.getenv("MYSQL_PORT")),
    password=os.getenv("MYSQL_PASSWORD"),
    user=os.getenv("MYSQL_USER"),
    database=os.getenv("MYSQL_DATABASE"),
    logger=logging.getLogger(MysqlConnection.__module__)
)

def main():
    mysql.connect()
    for table in tables_query:
        mysql.create_table(table)

main()