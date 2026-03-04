import yaml

class YamlConfigManager:
    def __init__(self, path):
        self.path = path
        with open(path, "r") as f:
            self.config = yaml.safe_load(f)

    def save(self):
        with open(self.path, "w") as f:
            yaml.safe_dump(self.config, f, sort_keys=False)

    def get_table(self, name):
        for table in self.config["tables"]:
            if table["name"] == name:
                return table
        return None
    
    def add_table(self, new_table: dict):
        for table in self.config["tables"]:
            if table["target_schema"].lower() == new_table["target_schema"].lower() and table["target_table"].lower() == new_table["target_table"].lower():
                raise ValueError("Table already exists")
        self.config["tables"].append(new_table)

    def delete_table(self, schema_name: str, table_name: str):
        for t in self.config["tables"]:
            print(t["target_schema"].lower(), t["target_table"].lower(), schema_name.lower(), table_name.lower(), t["target_schema"].lower() != schema_name.lower(), t["target_table"].lower() != table_name.lower())

        self.config["tables"] = [
            table for table in self.config["tables"]
            if table["target_schema"].lower() != schema_name.lower() or table["target_table"].lower() != table_name.lower()
        ]

    def add_column(self, table_name: str, new_column: dict):
        for table in self.config["tables"]:
            if table["name"] == table_name:
                table.setdefault("columns", [])

                # prevent duplicate columns
                for col in table["columns"]:
                    if col["source"] == new_column["source"]:
                        raise ValueError("Column already exists")

                table["columns"].append(new_column)
                return
        raise ValueError("Table not found")
    
    def delete_column(self, table_name: str, column_name: str):
        for table in self.config["tables"]:
            if table["name"] == table_name:
                table["columns"] = [
                    col for col in table.get("columns", [])
                    if col["source"] != column_name
                ]
                return
        raise ValueError("Table not found")
    
yaml_manager = YamlConfigManager(r"D:\gp\backend\config.yaml")
def get_config_manager():
    return yaml_manager

