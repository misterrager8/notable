from pathlib import Path

import click
import dotenv

settings = dotenv.dotenv_values()

HOME_DIR = Path(settings.get("home_dir") or Path(__file__).parent.parent / "Notes")
CLI_COLOR = settings.get("cli_color") or "green"
PORT = settings.get("port") or "5001"

if not HOME_DIR.exists():
    HOME_DIR.mkdir()
    click.secho("No home directory set. Using package directory", fg="yellow")


def set(key, value):
    dotenv.set_key(dotenv.find_dotenv(), key, value)
