import json
from pydantic import BaseModel
from datetime import datetime

def validate_json(data, logger):
    try:
        data = json.dumps(data)
        logger.info(f"valid json, returning data as python")
        return data
    except Exception as e:
        logger.error(f"invalid json, returning data as json")

class Intel(BaseModel):
    signal_id: str
    timestamp: datetime
    entity_id: str
    reported_lat: float
    reported_lon: float
    signal_type: str
    priority_level: int

def validate_fields(data, logger):
    try:
        data_as_pydantic = Intel(data)
        logger.info(f"valid! all fields exist")
        return data
    except Exception as e:
        logger.info(f"invalid! not all fields exist")
        return None

def validate_status(mysql_connection, entity_id, logger):
    try:
        result = mysql_connection.cursor.execute(f"""
                SELECT status FROM entities
                WHERE id LIKE {entity_id}
                """
                )
        logger.info(f" result from status check: {result}")
        if not result:
            return False
        if result['status'] == "destroyed":
            return False
        return True
    except Exception as e:
        logger.error(f"error validating status: {e}")


def run_validations(data, mysql_connection, logger):
    json_validation = validate_json(data=data, logger=logger)
    if not json_validation:
        return False
    fields_validation = validate_fields(data=data, logger=logger)
    if not fields_validation:
        return False
    data = json.loads(data)
    status_validation = validate_status(
        mysql_connection=mysql_connection,
        entity_id=data['entity_id'],
        logger=logger
    )
    if not status_validation:
        return False
    return True