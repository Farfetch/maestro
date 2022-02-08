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

run-client:
	nodemon --exec JMETER_CONTAINER_NAME=maestrojmeter-client AGENT_HOST=client.maestro.net python run.py

run-server1:
	nodemon --exec JMETER_CONTAINER_NAME=maestrojmeter-server1 AGENT_HOST=server1.maestro.net python run.py

run-server2:
	nodemon --exec JMETER_CONTAINER_NAME=maestrojmeter-server2 AGENT_HOST=server2.maestro.net python run.py

coverage:
	pytest --cov-report term-missing --cov=maestro_agent tests

coverage-html:
	pytest --cov-report html --cov=maestro_agent tests

coverage-xml:
	pytest --cov-report xml --cov=maestro_agent tests

clean: dev-clean-pyc

install-dev: dev-clean-pyc deps

check: lint format
