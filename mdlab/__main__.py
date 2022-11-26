import webbrowser
from pathlib import Path

import click
import dotenv

from mdlab import config, create_app


@click.group()
def cli():
    pass


@cli.command()
def get_config():
    for i in config.config_dict.items():
        click.secho(f"{i[0]}: {i[1]}")


@cli.command()
@click.argument("key")
@click.argument("value")
def set_config(key, value):
    dotenv.set_key(Path(__file__).parent.parent / ".env", key, value)
    click.secho(f"Config {key} set to {value}.")


@cli.command()
@click.option("--switch", "-s", is_flag=True)
def run(switch: bool):
    app = create_app(config)
    if switch:
        webbrowser.open(f"http://localhost:{config.PORT}")
    app.run(port=config.PORT)
