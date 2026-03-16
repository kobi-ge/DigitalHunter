from consumer import KafkaCounsumer

import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
def main():
    logger = logging.getLogger(__name__)
    a = KafkaCounsumer(
        host="kafka",
        port=9092,
        logger=logger
    )
    a.init_consumer()
    a.consume()
main()