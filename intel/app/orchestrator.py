from validations import run_validations
from dal import *

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
            data = self.consumer.consume()
            valid = run_validations(data=data)
            data = json.loads(data)
            if not valid:
                self.producer.produce(data)
                continue
            self.mysql.insert(
                query=insert_intel_query,
                data=data
            )
            

