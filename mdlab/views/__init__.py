from pathlib import Path

import dotenv
from flask import current_app, redirect, render_template, request

from mdlab import config
from mdlab.models import Folder, Memo, Note


@current_app.context_processor
def get_folders():
    return dict(folders=Folder.all())


@current_app.context_processor
def get_notes():
    def get_notes_(sort: str = "last_modified", reverse: bool = True):
        return Note.all(sort, reverse)

    return dict(notes=get_notes_)


@current_app.context_processor
def get_favorites():
    return dict(favorites_=Note.favorites())


@current_app.context_processor
def get_memos():
    return dict(memos_=Memo.all())


@current_app.route("/")
def index():
    sort = request.args.get("sort", default="last_modified")
    reverse = request.args.get("reverse", default="True")

    return render_template("index.html", sort=sort, reverse=reverse.lower() == "true")


@current_app.route("/settings", methods=["POST", "GET"])
def settings():
    if request.method == "GET":
        return render_template("settings.html", settings_=config.config_dict)
    else:
        dotenv.set_key(
            Path(__file__).parent.parent.parent / ".env",
            "home_dir",
            request.form.get("home_dir"),
        )
        dotenv.set_key(
            Path(__file__).parent.parent.parent / ".env",
            "debug",
            request.form.get("debug"),
        )
        dotenv.set_key(
            Path(__file__).parent.parent.parent / ".env",
            "port",
            request.form.get("port"),
        )

        return redirect(request.referrer)
