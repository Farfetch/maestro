from maestro_api.db.models.run import RunStatus
from maestro_api.db.models.agent import AgentStatus
from maestro_api.db.models.agent_log import AgentLogLevel

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

agent_log_create_schema = {
    "properties": {
        "agent_id": {
            "type": "string",
            "minLength": 12,
            "maxLength": 24,
        },
        "log_message": {
            "type": "string",
        },
        "level": {"type": "string"},
    },
    "required": ["agent_id", "log_message", "level"],
    "additionalProperties": False,
}

agent_log_list_schema = {
    "type": "object",
    "properties": {
        "date_from": {"type": "string", "format": "datetime"},
        "agent_ids": {
            "anyOf": [
                {
                    "type": "array",
                    "items": {"type": "string", "minLength": 12, "maxLength": 24},
                },
                {"type": "string", "minLength": 12, "maxLength": 24},
            ]
        },
        "sort": {"type": "string"},
        "level": {"type": "string", "enum": AgentLogLevel.list()},
    },
    "required": ["date_from"],
    "additionalProperties": False,
}
