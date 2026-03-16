import os
import logging

from consumer import KafkaConsumer
from mysql_connection import MysqlConnection
from dal import insert_query

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

consumer_instance = KafkaConsumer(logger=logger)
mysql_instance = MysqlConnection(
    host=os.getenv("MYSQL_HOST", "LOCALHOST"),
    port=int(os.getenv("MYSQL_PORT", 3306)),
    password=os.getenv("MYSQL_PASSWORD", "pass"),
    user=os.getenv("MYSQL_USER", "kobi"),
    database=os.getenv("MYSQL_DATABASE", "targets_bank"),
    logger=logger
)

def main():
    consumer_instance.init_consumer()
    mysql_instance.connect()
    while True:
        data = consumer_instance.consume()
        if data:
            mysql_instance.insert(query=insert_query, data=data)
            mysql_instance.update(data['attack_id'])

main()