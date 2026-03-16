import json

from confluent_kafka import Consumer


class KafkaCounsumer:
    def __init__(self, host, port, logger):
        self.host = host
        self.port = port
        self.config = {
    "bootstrap.servers": "localhost:9092",
    "group.id": "tean-intel",
    "auto.offset.reset": "earliest"
}
        self.logger = logger
    
    def init_consumer(self):
        try:
            self.consumer = Consumer(self.config)
            self.consumer.subscribe(["intel"])
            self.logger.info("🟢 Consumer is running and subscribed to intel topic")
        except Exception as e:
            self.logger.error(f"error creating consumer: {e}")

    def consume(self):
        try:
            while True:
                self.logger.info("starting consume operation")
                msg = self.consumer.poll(1.0)
                if msg is None:
                    continue
                if msg.error():
                    print("❌ Error:", msg.error())
                    continue

                value = msg.value().decode("utf-8")
                self.logger.info(f"recieved data: {value}")
                return(value)
        except KeyboardInterrupt:
            self.logger.error("\n🔴 Stopping consumer")

        # finally:
        #     self.consumer.close()


