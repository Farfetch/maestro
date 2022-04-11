# ALL commands should be executed inside application Python environment

dev-clean-pyc: ## Remove compiled bytecode of source files
	@find . -name '*.pyc' -exec rm -f {} +
	@find . -name '*.pyo' -exec rm -f {} +
	@find . -name '__pycache__' -exec rm -fr {} +
	@find . -name '*.pytest_cache' -exec rm -fr {} +

deps:
	pipenv install --system --dev

format:
	black maestro_cli tests --check

format-fix:
	black maestro_cli tests

lint:
	flake8 maestro_cli tests

test:
	pytest

run:
	python cli.py

coverage:
	pytest --cov-report term-missing --cov=maestro_cli tests

coverage-html:
	pytest --cov-report html --cov=maestro_cli tests

coverage-xml:
	pytest --cov-report xml --cov=maestro_cli tests

clean: dev-clean-pyc

install-dev: dev-clean-pyc deps

check: lint format
