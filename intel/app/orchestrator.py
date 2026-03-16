from validations import run_validations
from dal import *
from haversine import haversine_km

import json

class Orchestrator:
    def __init__(self, logger, mysql, consumer, producer):
        self.logger = logger
        self.mysql = mysql
        self.consumer = consumer
        self.producer = producer

    def init_svcs(self):
        self.mysql.connect()
        self.consumer.init_consumer()
        self.producer.init_producer()

    def run(self):
        while True:
            self.logger.info(f"starting to run the program")
            data = self.consumer.consume()
            if not data:
                break
            valid = run_validations(
                data=data,
                mysql_connection=self.mysql,
                logger=self.logger
            )
            if not valid:
                self.producer.produce(data)
                continue
            self.logger.info(f"data: {data}")
            data = json.loads(data)
            self.mysql.insert(
                query=insert_intel_query,
                data=data
            )
            if self.mysql.check_existance(data['entity_id']):
                query = prepare_update_query(data=data)
                self.mysql.update(query)
            else:
                self.mysql.insert(query=insert_entities_query, data=data)
 
            

