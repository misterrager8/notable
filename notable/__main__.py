import pprint
import webbrowser

import click
import pyperclip

from notable import config
from notable.models import Note
from notable.web import create_app


@click.group()
def cli():
    pass


@cli.command()
def get_config():
    click.secho(pprint.pformat(dict(config.settings)), fg=config.CLI_COLOR)


@cli.command()
@click.argument("key")
@click.argument("value")
def set_config(key, value):
    config.set(key, value)

    click.secho(f"{key} set to {value}", fg=config.CLI_COLOR)


@cli.command()
@click.option("-d", "--debug", is_flag=True)
def web(debug):
    app = create_app(config)
    if not debug:
        webbrowser.open(f"http://localhost:{config.PORT}")
    app.run(debug=debug, port=config.PORT)


@cli.command()
@click.argument("name")
def add_note(name):
    note_ = Note.add(config.HOME_DIR / f"{name}.txt")

    click.secho(f"{note_.path.name} added.", fg=config.CLI_COLOR)


@cli.command()
def view_notes():
    click.secho(
        "\n".join(
            [f"[{str(id).ljust(2)}] {str(i)}" for id, i in enumerate(Note.all())]
        ),
        fg=config.CLI_COLOR,
    )


@cli.command()
@click.option("--id", prompt=True, type=click.INT)
def view_note(id):
    note_ = Note.all()[id]

    click.secho(note_.content, fg=config.CLI_COLOR)


@cli.command()
@click.option("--id", prompt=True, type=click.INT)
def copy_note(id):
    note_ = Note.all()[id]
    pyperclip.copy(note_.content)

    click.secho(f"{note_.name} copied.", fg=config.CLI_COLOR)
