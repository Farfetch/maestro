# Maestro API

Python Flask REST API

## Requirements

- Python [v3.9.5](https://www.python.org/downloads/release/python-395/)
- MongoDB v4.2

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

`make dev` - Run application in Development mode. In this mode application will be run with debugged attached and reload once any of files changed. The command should not be used in production.

### Linting & Formatting

`make check` - - Run linting and formatting checks

`make lint` - Run **Pylint** linting checks

`make format` - Run **black** formatting checks

`make format-fix` - Run **black** to fix files formatting automatically

### Testing

`make test` - Run tests

`make coverage` - Run tests and generate code coverage reports
