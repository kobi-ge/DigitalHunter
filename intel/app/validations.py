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
        logger.error(f"invalid! not all fields exist")

