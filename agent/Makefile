# ALL commands should be executed inside application Python environment

dev-clean-pyc: ## Remove compiled bytecode of source files
	@find . -name '*.pyc' -exec rm -f {} +
	@find . -name '*.pyo' -exec rm -f {} +
	@find . -name '__pycache__' -exec rm -fr {} +
	@find . -name '*.pytest_cache' -exec rm -fr {} +

deps:
	pipenv install --system --dev

format:
	black maestro_agent tests --check

format-fix:
	black maestro_agent tests

lint:
	flake8 maestro_agent tests

test:
	pytest

run:
	JMETER_CONTAINER_NAME=maestrojmeter AGENT_HOST=agent.maestro.net LOG_LEVEL=DEBUG python run.py

run1:
	HOST_MOUNT_DIR=$HOME/.maestro/jmeter1 JMETER_CONTAINER_NAME=maestrojmeter1 AGENT_HOST=agent1.maestro.net python run.py

run2:
	HOST_MOUNT_DIR=$HOME/.maestro/jmeter2 JMETER_CONTAINER_NAME=maestrojmeter2 AGENT_HOST=agent2.maestro.net python run.py

coverage:
	pytest --cov-report term-missing --cov=maestro_agent tests

coverage-html:
	pytest --cov-report html --cov=maestro_agent tests

coverage-xml:
	pytest --cov-report xml --cov=maestro_agent tests

clean: dev-clean-pyc

install-dev: dev-clean-pyc deps

check: lint format
