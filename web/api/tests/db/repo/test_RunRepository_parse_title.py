from maestro_api.db.repo.run import RunRepository


def test_parse_title():
    title = "SS23 Portal {MAX_RPS}x{NUM_AGENTS} - Duration:{duration}"
    num_agents = 1
    custom_properties = [{"name": "duration", "value": "600"}]
    max_rps = 100
    parsed_title = RunRepository().parse_title(
        title, num_agents, custom_properties, max_rps
    )

    expected_title = "SS23 Portal 100x1 - Duration:600"
    assert parsed_title == expected_title


def test_parse_title_multiple_custom_props():
    title = (
        "SS23 Portal {MAX_RPS}x{NUM_AGENTS} - Duration:{duration} - loop:{loop_value}"
    )
    num_agents = 1
    custom_properties = [
        {"name": "duration", "value": "600"},
        {"name": "loop_value", "value": "45"},
    ]
    max_rps = 100
    parsed_title = RunRepository().parse_title(
        title, num_agents, custom_properties, max_rps
    )

    expected_title = "SS23 Portal 100x1 - Duration:600 - loop:45"
    assert parsed_title == expected_title


def test_parse_title_max_rps_is_zero():
    title = (
        "SS23 Portal {MAX_RPS}x{NUM_AGENTS} - Duration:{duration} - loop:{loop_value}"
    )
    num_agents = 1
    custom_properties = [
        {"name": "duration", "value": "600"},
        {"name": "loop_value", "value": "45"},
    ]
    max_rps = 0
    parsed_title = RunRepository().parse_title(
        title, num_agents, custom_properties, max_rps
    )

    expected_title = "SS23 Portal x1 - Duration:600 - loop:45"
    assert parsed_title == expected_title


def test_parse_title_no_tokens():
    title = "SS23 Portal - Duration: - loop:"
    num_agents = 1
    custom_properties = [
        {"name": "duration", "value": "600"},
        {"name": "loop_value", "value": "45"},
    ]
    max_rps = 100
    parsed_title = RunRepository().parse_title(
        title, num_agents, custom_properties, max_rps
    )

    expected_title = "SS23 Portal - Duration: - loop:"
    assert parsed_title == expected_title


def test_parse_title_invalid_token():
    title = (
        "SS23 Portal {MAX_RPS}x{NUM_AGENTS} - Duration:{duration} - loop:{bananinha}"
    )
    num_agents = 1
    custom_properties = [
        {"name": "duration", "value": "600"},
        {"name": "loop_value", "value": "45"},
    ]
    max_rps = 100
    parsed_title = RunRepository().parse_title(
        title, num_agents, custom_properties, max_rps
    )

    expected_title = "SS23 Portal 100x1 - Duration:600 - loop:{bananinha}"
    assert parsed_title == expected_title

