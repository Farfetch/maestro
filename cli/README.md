# Maestro CLI

Python CLI Application to manage tests execution through [Maestro API](../web/api)

## Requirements

- Python [v3.9.5](https://www.python.org/downloads/release/python-395/)

## Installation

- Create Python Virtual environment

```bash
python3.9 -m venv venv
source venv/bin/activate
```

> All following commands should be executed inside virtual environment

- Use the package manager [pip](https://pip.pypa.io/en/stable/) to install Pipenv.

```bash
pip install pipenv
```

- Install Dev environment

```bash
make install-dev
```

## Usage

### Running application

Development:

`make run` - Run Python Maestro CLI application

### Linting & Formatting

`make check` - - Run linting and formatting checks

`make lint` - Run **Pylint** linting checks

`make format` - Run **Black** formatting checks

`make format-fix` - Run **Black** to fix files formatting automatically

### Testing

`make test` - Run tests

`make coverage` - Run tests and generate code coverage reports
