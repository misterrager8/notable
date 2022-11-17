from flask import current_app, render_template, request

from mdlab.models import Folder, Note


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


@current_app.route("/")
def index():
    sort = request.args.get("sort", default="last_modified")
    reverse = request.args.get("reverse", default="True")

    return render_template("index.html", sort=sort, reverse=reverse.lower() == "true")
