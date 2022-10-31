from flask import Blueprint, redirect, request

from mdlab import config
from mdlab.models import Note

notes = Blueprint("notes", __name__)


@notes.route("/create_note", methods=["POST"])
def create_note():
    note_ = Note(
        config.HOME_DIR
        / request.form.get("folder")
        / (request.form.get("name") + ".md")
    )
    note_.create()

    return redirect(request.referrer)


@notes.route("/get_favorites")
def get_favorites():
    return dict(favs=[i.to_dict() for i in Note.favorites()])


@notes.route("/get_markdown")
def get_markdown():
    note_ = Note(
        config.HOME_DIR / request.args.get("folder") / request.args.get("name")
    )
    return note_.markdown


@notes.route("/get_text")
def get_text():
    note_ = Note(
        config.HOME_DIR / request.args.get("folder") / request.args.get("name")
    )
    return note_.text


@notes.route("/edit_note", methods=["POST"])
def edit_note():
    note_ = Note(
        config.HOME_DIR / request.form.get("folder") / request.form.get("name")
    )
    note_.edit(request.form.get("text"))

    return redirect(request.referrer)


@notes.route("/toggle_favorite")
def toggle_favorite():
    note_ = Note(
        config.HOME_DIR / request.args.get("folder") / request.args.get("name")
    )
    note_.toggle_favorite()

    return redirect(request.referrer)


@notes.route("/delete_note")
def delete_note():
    note_ = Note(
        config.HOME_DIR / request.args.get("folder") / request.args.get("name")
    )
    note_.delete()

    return redirect(request.referrer)
