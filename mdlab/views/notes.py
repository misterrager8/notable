import datetime

from flask import Blueprint, redirect, render_template, request, url_for

from mdlab import config
from mdlab.models import Note

notes = Blueprint("notes", __name__)


@notes.route("/create_note", methods=["POST"])
def create_note():
    name_ = (
        request.form.get("name")
        or f"Note #{datetime.datetime.now().strftime('%y%m%d%H%M%S')}"
    )
    note_ = Note(config.HOME_DIR / request.args.get("folder") / f"{name_}.md")
    note_.create()

    return redirect(url_for("notes.note", folder=note_.folder.name, name=note_.name))


@notes.route("/note")
def note():
    note_ = Note(
        config.HOME_DIR / request.args.get("folder") / request.args.get("name")
    )

    return render_template("note.html", note_=note_)


@notes.route("/get_text")
def get_text():
    return Note(
        config.HOME_DIR / request.args.get("folder") / request.args.get("name")
    ).text


@notes.route("/get_markdown")
def get_markdown():
    return Note(
        config.HOME_DIR / request.args.get("folder") / request.args.get("name")
    ).markdown


@notes.route("/edit_note", methods=["POST"])
def edit_note():
    note_ = Note(
        config.HOME_DIR / request.form.get("folder") / request.form.get("name")
    )
    note_.edit(request.form.get("content"))

    return redirect(request.referrer)


@notes.route("/rename_note", methods=["POST"])
def rename_note():
    note_ = Note(
        config.HOME_DIR / request.args.get("folder") / request.args.get("name")
    )
    note_.rename(
        config.HOME_DIR / request.form.get("folder") / f"{request.form.get('name')}.md"
    )

    return redirect(
        url_for(
            "notes.note",
            folder=request.form.get("folder"),
            name=f"{request.form.get('name')}.md",
        )
    )


@notes.route("/delete_note")
def delete_note():
    note_ = Note(
        config.HOME_DIR / request.args.get("folder") / request.args.get("name")
    )
    folder_ = note_.folder.name
    note_.delete()

    return redirect(url_for("folders.folder", name=folder_))


@notes.route("/toggle_favorite")
def toggle_favorite():
    note_ = Note(
        config.HOME_DIR / request.args.get("folder") / request.args.get("name")
    )
    note_.toggle_favorite()

    return redirect(request.referrer)


@notes.route("/favorites")
def favorites():
    return render_template("favorites.html")


@notes.route("/search", methods=["POST"])
def search():
    return render_template(
        "search.html", results=Note.search(request.form.get("query"))
    )
