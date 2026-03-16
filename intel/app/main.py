from orchestrator import Orchestrator
from consumer import KafkaCounsumer
from producer import KafkaProducer
from mysql_connection import MysqlConnection


import logging
import os

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)


consumer_instance = KafkaCounsumer(
    host=os.getenv("KAFKA_HOST"),
    port=int(os.getenv("KAFKA_PORT")),
    logger=logging.getLogger(KafkaCounsumer.__module__)
)
producer_instance = KafkaProducer(
    host=os.getenv("KAFKA_HOST"),
    port=int(os.getenv("KAFKA_PORT")),
    logger=logging.getLogger(KafkaProducer.__module__)
)
mysql_instance = MysqlConnection(
    host=os.getenv("MYSQL_HOST"),
    port=int(os.getenv("MYSQL_PORT")),
    password=os.getenv("MYSQL_PASSWORD"),
    user=os.getenv("MYSQL_USER"),
    database=os.getenv("MYSQL_DATABASE"),
    logger=logging.getLogger((MysqlConnection.__module__))
)
orchestrator_instance = Orchestrator(
    logger=logging.getLogger(Orchestrator.__module__),
    mysql=mysql_instance,
    consumer=consumer_instance,
    producer=producer_instance
)

def main():
    orchestrator_instance.init_svcs()
    orchestrator_instance.run()
main()