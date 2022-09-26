import webbrowser

import click

from markdown_lab import config, create_app

app = create_app(config)


@click.group()
def cli():
    """Launch web interface"""
    pass


@cli.command()
@click.option("--switch", "-s", is_flag=True)
def run(switch):
    if switch:
        webbrowser.open(f"http://127.0.0.1:{config.FLASK_RUN_PORT}/")
    app.run(port=config.FLASK_RUN_PORT)
