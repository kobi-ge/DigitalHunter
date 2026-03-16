from orchestrator import Orchestrator
from consumer import KafkaConsumer
from producer import KafkaProducer
from mysql_connection import MysqlConnection


import logging
import os

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)


consumer_instance = KafkaConsumer(
    logger=logging.getLogger(KafkaConsumer.__module__)
)
producer_instance = KafkaProducer(
    host=os.getenv("KAFKA_HOST", "localhost"),
    port=int(os.getenv("KAFKA_PORT", 9092)),
    logger=logging.getLogger(KafkaProducer.__module__)
)
mysql_instance = MysqlConnection(
    host=os.getenv("MYSQL_HOST", "localhost"),
    port=int(os.getenv("MYSQL_PORT", 3306)),
    password=os.getenv("MYSQL_PASSWORD", "pass"),
    user=os.getenv("MYSQL_USER", "kobi"),
    database=os.getenv("MYSQL_DATABASE", "targets_bank"),
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