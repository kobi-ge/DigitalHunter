insert_intel_query = """
INSERT INTO intel (
    signal_id,
    timestamp,
    entity_id,
    reported_lat,
    reported_lon,
    signal_type,
    priority_level
)
VALUES (%(signal_id)s, %(timestamp)s, %(entity_id)s, %(reported_lat)s, 
%(reported_lon)s, %(signal_type)s, %(priority_level)s)
"""

insert_entities_query = """
INSERT INTO entities (
    id,
    reported_lat,
    reported_lon,
    priority_level,
    distance,
    status
)
VALUES (%(id)s, %(reported_lat)s, %(reported_lon)s, %(priority_level)s, 
%(distance)s, %(status)s)
"""
entity_id = ""

check_existance = f"""
SELECT * FROM entities
WHERE id LIKE {entity_id}
"""

update_entities_query = f"""
UPDATE entities
SET 
WHERE id LIKE {entity_id}
"""