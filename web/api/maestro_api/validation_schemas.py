from maestro_api.db.models.run import RunStatus
from maestro_api.db.models.run_agent import RunAgentStatus
from maestro_api.db.models.agent import AgentStatus
from maestro_api.db.models.agent_log import AgentLogLevel
from maestro_api.db.models.event import EventStatus, EventType

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
        "notes": {"type": "string"},
    },
    "oneOf": [
        {"required": ["run_status"]},
        {"required": ["notes"]},
    ],
    "additionalProperties": False,
}

run_configuration_create_schema = {
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "run_plan_id": {
            "type": "string",
            "minLength": 12,
            "maxLength": 24,
        },
        "client_agent_id": {
            "type": "string",
            "minLength": 12,
            "maxLength": 24,
        },
        "server_agent_ids": {
            "type": "array",
            "items": {"type": "string", "minLength": 12, "maxLength": 24},
        },
        "custom_data_ids": {
            "type": "array",
            "items": {"type": "string", "minLength": 12, "maxLength": 24},
        },
        "hosts": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "host": {"type": "string"},
                    "ip": {"type": "string"},
                },
                "required": [
                    "host",
                    "ip",
                ],
                "additionalProperties": False,
            },
        },
        "custom_properties": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "value": {"type": "string"},
                },
                "required": [
                    "name",
                    "value",
                ],
                "additionalProperties": False,
            },
        },
        "load_profile": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "start": {"type": "number"},
                    "end": {"type": "number"},
                    "duration": {"type": "number"},
                },
                "required": [
                    "start",
                    "end",
                    "duration",
                ],
                "additionalProperties": False,
            },
        },
    },
    "required": [
        "run_plan_id",
        "client_agent_id",
        "server_agent_ids",
    ],
    "additionalProperties": False,
}

run_metric_all_schema = {
    "type": "object",
    "properties": {
        "time_interval": {"type": "string"},
        "show_labels": {"type": "string"},
    },
}


run_agent_update_schema = {
    "type": "object",
    "properties": {
        "run_id": {
            "type": "string",
            "minLength": 12,
            "maxLength": 24,
        },
        "agent_id": {
            "type": "string",
            "minLength": 12,
            "maxLength": 24,
        },
        "agent_status": {
            "type": "string",
        },
        "error_message": {
            "type": "string",
        },
    },
    "required": ["run_id", "agent_id", "agent_status"],
    "additionalProperties": False,
}

run_agent_all_schema = {
    "type": "object",
    "properties": {
        "run_id": {
            "type": "string",
            "minLength": 12,
            "maxLength": 24,
        },
        "agent_id": {
            "type": "string",
            "minLength": 12,
            "maxLength": 24,
        },
        "agent_status": {
            "type": "string",
            "enum": RunAgentStatus.list(),
        },
    },
    "required": [],
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

event_update_schema = {
    "type": "object",
    "properties": {
        "event_status": {
            "type": "string",
            "enum": EventStatus.list(),
        },
    },
    "additionalProperties": False,
}

event_list_schema = {
    "type": "object",
    "properties": {
        "event_status": {
            "type": "string",
            "enum": EventStatus.list(),
        },
        "event_type": {
            "type": "string",
            "enum": EventType.list(),
        },
        "agent_id": {
            "type": "string",
            "minLength": 12,
            "maxLength": 24,
        },
    },
    "additionalProperties": False,
}
