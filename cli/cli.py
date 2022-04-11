import argparse

from maestro_cli.commands.run import run_command

def default_func(args):
   parser.print_help()


parser = argparse.ArgumentParser(prog="Maestro CLI", usage="maestro-cli")
parser.set_defaults(func=default_func)
subparsers = parser.add_subparsers()


parser_foo = subparsers.add_parser('run')
parser_foo.add_argument('configuration_id', type=str, help="Run Configuration to start a test")
parser_foo.set_defaults(func=run_command)


args = parser.parse_args()

if args:
  args.func(args)
else:
  parser.print_help()
