import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)
a = MysqlConnection(
    host="localhost",
    port=3306,
    password="pass",
    user="kobi",
    database="targets_bank",
    logger=logger
)
a.connect()

entities_table_query = """
CREATE TABLE IF NOT EXISTS entities
(
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(40),
    type VARCHAR(40),
    status VARCHAR(30)
)
"""
intel_table_query = """
CREATE TABLE IF NOT EXISTS intel
(
    signal_id VARCHAR(100) PRIMARY KEY,
    timestamp DATE,
    entity_id VARCHAR(20),
    reported_lat INT,
    reported_lon INT,
    signal_type VARCHAR(20),
    priority_level int
)
"""

attack_table_query = """
CREATE TABLE IF NOT EXISTS attack
(
    attack_id VARCHAR(100) PRIMARY KEY,
    entity_id VARCHAR(100),
    weapon_type VARCHAR(30)
)
"""

damage_table_query = """
CREATE TABLE IF NOT EXISTS damage
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    attack_id VARCHAR(100),
    entity_id VARCHAR(100),
    result VARCHAR(30)
)
"""

tables_query = [
    entities_table_query, intel_table_query, attack_table_query, damage_table_query
]

for table in tables_query:
    a.create_table(table)