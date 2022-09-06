import click
from MarkdownLab import create_app, config


app = create_app(config)


@click.group()
def cli():
    """MarkdownLab"""
    pass


@cli.command()
def run():
    """Launch web interface"""
    app.run(port=config.PORT)
