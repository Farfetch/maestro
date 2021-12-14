# ALL commands should be executed inside application Python environment


dev-clean-pyc: ## Remove compiled bytecode of source files
	@find . -name '*.pyc' -exec rm -f {} +
	@find . -name '*.pyo' -exec rm -f {} +
	@find . -name '__pycache__' -exec rm -fr {} +
	@find . -name '*.pytest_cache' -exec rm -fr {} +

deps:
	pipenv install --system --dev

format:
	black maestro_api tests --check

format-fix:
	black maestro_api tests

lint:
	flake8 maestro_api tests

test:
	pytest

dev:
	FLASK_ENV=development FLASK_APP=wsgi:maestro_app flask run

coverage:
	pytest --cov-report term-missing --cov=maestro_daemon tests

coverage-html:
	pytest --cov-report html --cov=maestro_api tests

clean: dev-clean-pyc

install-dev: dev-clean-pyc deps

check: lint format
