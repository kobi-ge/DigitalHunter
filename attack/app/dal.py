insert_query = """
INSERT INTO atack (
    attack_id,
    entity_id,
    weapon_type
)
VALUES (%(attack_id)s, %(entity_id)s, %(weapon_type)s)
"""

