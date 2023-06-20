import webbrowser

import click
from flask import Flask


@click.group()
def cli():
    pass


@cli.command()
@click.option("-d", "--debug", is_flag=True)
@click.option("-p", "--port", default="5000")
def run(debug, port):
    app = Flask(__name__)
    with app.app_context():
        from . import routes
    if not debug:
        webbrowser.open(f"http://localhost:{port}")
    app.run(debug=debug, port=port)
