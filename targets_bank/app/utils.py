entities_table_query = """
CREATE TABLE IF NOT EXISTS entities
(
    id VARCHAR(20) PRIMARY KEY,
    reported_lat DECIMAL(20, 20),
    reported_lon DECIMAL(20, 20),
    priority_level INT,
    distance DECIMAL(20, 20),
    status VARCHAR(30)
)
"""
intel_table_query = """
CREATE TABLE IF NOT EXISTS intel
(
    signal_id VARCHAR(100) PRIMARY KEY,
    timestamp DATE,
    entity_id VARCHAR(20),
    reported_lat DECIMAL(20, 20),
    reported_lon DECIMAL(20, 20),
    signal_type VARCHAR(20),
    priority_level INT
)
"""

attack_table_query = """
CREATE TABLE IF NOT EXISTS atack
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
