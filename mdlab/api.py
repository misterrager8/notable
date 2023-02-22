import datetime

import html2text
import requests
from bs4 import BeautifulSoup
from flask import current_app, render_template, request
from readability import Document

from . import config
from .models import Folder, Note

# FOLDERS


@current_app.get("/get_folders")
def get_folders():
    return dict(folders=[i.to_dict() for i in Folder.all()])


@current_app.get("/create_folder")
def create_folder():
    folder_ = Folder(
        config.HOME_DIR
        / f"Untitled Folder {datetime.datetime.now().strftime('%m%d%y%I%M%p')}"
    )
    folder_.create()

    return folder_.to_dict()


@current_app.get("/get_folder")
def get_folder():
    folder_ = Folder(config.HOME_DIR / request.args.get("name"))

    return folder_.to_dict()


@current_app.get("/get_favorites")
def get_favorites():
    return dict(favs=[i.to_dict() for i in Note.favorites()])


@current_app.post("/rename_folder")
def rename_folder():
    folder_ = Folder(config.HOME_DIR / request.form.get("folder"))
    folder_.rename(config.HOME_DIR / request.form.get("new_name"))
    new_folder = Folder(config.HOME_DIR / request.form.get("new_name"))

    return new_folder.to_dict()


@current_app.get("/delete_folder")
def delete_folder():
    folder_ = Folder(config.HOME_DIR / request.args.get("name"))
    folder_.delete()

    return dict(folders=[i.to_dict() for i in Folder.all()])


# NOTES


@current_app.get("/get_note")
def get_note():
    note_ = Note(
        config.HOME_DIR / request.args.get("folder") / request.args.get("name")
    )

    return note_.to_dict()


@current_app.get("/create_note")
def create_note():
    note_ = Note(
        config.HOME_DIR
        / request.args.get("folder")
        / f"Untitled Note {datetime.datetime.now().strftime('%m%d%y%I%M%p')}.md"
    )
    note_.create()

    return dict(note=note_.to_dict(), folder=note_.folder.to_dict())


@current_app.post("/save_note")
def save_note():
    document = Document(requests.get(request.form.get("url")).text)
    title = document.short_title()
    parsed_html = BeautifulSoup(document.summary(), "html.parser")

    note_ = Note(config.HOME_DIR / request.form.get("folder") / f"{title}.md")
    note_.create()
    note_.edit(html2text.html2text(str(parsed_html), bodywidth=0))

    return dict(note=note_.to_dict(), folder=note_.folder.to_dict())


@current_app.post("/edit_note")
def edit_note():
    note_ = Note(
        config.HOME_DIR / request.form.get("folder") / request.form.get("name")
    )
    note_.edit(request.form.get("content"))

    return note_.to_dict()


@current_app.post("/rename_note")
def rename_note():
    note_ = Note(
        config.HOME_DIR / request.form.get("folder") / request.form.get("name")
    )
    note_.rename(
        config.HOME_DIR
        / request.form.get("folder")
        / f"{request.form.get('new_name')}.md"
    )
    new_note = Note(
        config.HOME_DIR
        / request.form.get("folder")
        / f"{request.form.get('new_name')}.md"
    )

    return dict(note=new_note.to_dict(), folder=new_note.folder.to_dict())


@current_app.get("/toggle_favorite")
def toggle_favorite():
    note_ = Note(
        config.HOME_DIR / request.args.get("folder") / request.args.get("name")
    )
    note_.toggle_favorite()

    return ""


@current_app.get("/delete_note")
def delete_note():
    note_ = Note(
        config.HOME_DIR / request.args.get("folder") / request.args.get("name")
    )
    folder_ = note_.folder
    note_.delete()

    return folder_.to_dict()


# MISC


@current_app.get("/")
def index():
    return render_template("index.html")
