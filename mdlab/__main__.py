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
    """See all configuration options."""
    for i in config.config_dict.items():
        click.secho(f"{i[0]}: {i[1]}")


@cli.command()
@click.argument("key")
@click.argument("value")
def set_config(key, value):
    """Set a configuration option.

    Args:
        key (str): Name of the variable being set
        value (str): Value of the variable being set
    """
    dotenv.set_key(Path(__file__).parent.parent / ".env", key, value)
    click.secho(f"Config {key} set to {value}.")


@cli.command()
@click.option("--debug", "-d", is_flag=True)
def run(debug: bool):
    """Start the MarkdownLab app.

    Args:
        switch (bool, optional): switch automatically to browser when starting app. Default is False
    """
    app = create_app(config)
    if not debug:
        webbrowser.open(f"http://localhost:{config.PORT}/")
    app.config["ENV"] = "development" if debug else "production"
    app.run(port=config.PORT, debug=debug)
