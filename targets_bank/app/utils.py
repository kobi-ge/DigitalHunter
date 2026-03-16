tables_query = [

]
entities_table_query = """
CREATE TABLE IF NOT EXISTS entities
(
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(40),
    type VARCHAR(40),
    status VARCHAR(30)
)
"""