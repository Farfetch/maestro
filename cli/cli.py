import argparse

from maestro_cli.logging import Logger
from maestro_cli.commands.run import run_command

Logger.setup_logging()


def default_func(args):
    parser.print_help()


parser = argparse.ArgumentParser(prog="Maestro CLI", usage="maestro-cli")
parser.set_defaults(func=default_func)
subparsers = parser.add_subparsers()


parser_run = subparsers.add_parser("run")
parser_run.add_argument(
    "configuration_id", type=str, help="Run Configuration to start a test"
)
parser_run.set_defaults(func=run_command)


args = parser.parse_args()

if args:
    args.func(args)
else:
    parser.print_help()
