# Maestro Agent

Python Application to manage Apache JMeter tests execution.

## Requirements

-   Python [v3.9.5](https://www.python.org/downloads/release/python-395/)
-   Nodemon [2.0.15](https://github.com/remy/nodemon/releases/tag/v2.0.15)
-   MongoDB v4.2

## Installation

-   Create Python Virtual environment

```bash
python3.9 -m venv venv
source venv/bin/activate
```

-   Install Nodemon

```bash
npm i -g nodemon@2.0.15
```

> All following commands should be executed inside virtual environment

-   Use the package manager [pip](https://pip.pypa.io/en/stable/) to install Pipenv.

```bash
pip install pipenv
```

-   Install Dev environment

```bash
make install-dev
```

## Usage

### Running application

Development:

`make run-client` - Run client.maestro.net agent with watch mode enabled.

`make run-server1` - Run client.maestro.net agent with watch mode enabled.

`make run-server2` - Run client.maestro.net agent with watch mode enabled.

Production:

`python run.py` - Run Maestro Agent application.

### Linting & Formatting

`make check` - - Run linting and formatting checks.

`make lint` - Run **Pylint** linting checks.

`make format` - Run **Black** formatting checks.

`make format-fix` - Run **Black** to fix files formatting automatically.

### Testing

`make test` - Run tests.

`make coverage` - Run tests and generate code coverage reports.
