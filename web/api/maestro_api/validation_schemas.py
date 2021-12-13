from maestro_api.db.models.run import RunStatus

create_run_schema = {
    "type": "object",
    "properties": {
        "run_configuration_id": {
            "type": "string",
            "minLength": 12,
            "maxLength": 24,
        },
    },
    "required": [
        "run_configuration_id",
    ],
    "additionalProperties": False,
}
update_run_schema = {
    "type": "object",
    "properties": {
        "run_status": {"type": "string", "enum": RunStatus.list()},
    },
    "required": ["run_status"],
    "additionalProperties": False,
}
