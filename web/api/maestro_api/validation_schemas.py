from maestro_api.db.models.run import RunStatus
from maestro_api.db.models.agent import AgentStatus

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

agent_create_schema = {
    "type": "object",
    "properties": {
        "hostname": {
            "type": "string",
            "description": "agent hostname",
        },
        "ip": {
            "type": "string",
            "description": "agent IP",
        },
    },
    "required": ["hostname", "ip"],
    "additionalProperties": False,
}

agent_update_schema = {
    "type": "object",
    "properties": {
        "agent_status": {
            "type": "string",
            "enum": AgentStatus.list(),
        },
    },
    "required": ["agent_status"],
    "additionalProperties": False,
}
