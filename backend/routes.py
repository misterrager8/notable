import datetime
from pathlib import Path

import html2text
import requests
from bs4 import BeautifulSoup
from flask import current_app, render_template, request, send_from_directory

from .models import Folder, Note


@current_app.route("/")
def index():
    return send_from_directory(current_app.static_folder, "index.html")

@current_app.post("/about")
def about():
    success = True
    msg = ""
    readme_ = ""

    try:
        readme_ = open(Path(__file__).parent.parent.parent / "README.md").read()
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
        "readme": readme_,
    }


@current_app.post("/notes")
def notes():
    sort = request.json.get("sort")
    filter_ = request.json.get("filter_")
    return {"notes": [i.to_dict() for i in Note.all(sort=sort, filter=filter_)]}


@current_app.post("/folders")
def folders():
    return {"folders": [i.name for i in Folder.all()]}


@current_app.post("/save_page")
def save_page():
    note_ = Note(request.json.get("path"))
    soup = BeautifulSoup(requests.get(request.json.get("url")).text, "html.parser")

    note_.edit(html2text.html2text(str(soup), bodywidth=0))

    return note_.to_dict()


@current_app.post("/add_note")
def add_note():
    note_ = Note.add(
        f"{datetime.datetime.now().strftime('%y%m%d')}, note",
        request.json.get("folder"),
    )

    return note_.to_dict()


@current_app.post("/add_folder")
def add_folder():
    folder_ = Folder.add(f"{datetime.datetime.now().strftime('%y%m%d')}, folder")

    return {"status": "done"}


@current_app.post("/delete_folder")
def delete_folder():
    folder_ = Folder(request.json.get("name"))
    folder_.delete()

    return {"status": "done"}


@current_app.post("/note")
def note():
    note_ = Note(request.json.get("path"))

    return note_.to_dict()


@current_app.post("/edit_note")
def edit_note():
    note_ = Note(request.json.get("path"))
    note_.edit(request.json.get("content"))

    return note_.to_dict()


@current_app.post("/rename_note")
def rename_note():
    note_ = Note(request.json.get("path"))

    return note_.rename(request.json.get("new_name")).to_dict()


@current_app.post("/fixup_title")
def fixup_title():
    note_ = Note(request.json.get("path"))

    return note_.fixup_title().to_dict()


@current_app.post("/change_folder")
def change_folder():
    note_ = Note(request.json.get("path"))

    return note_.change_folder(request.json.get("new_folder")).to_dict()


@current_app.post("/rename_folder")
def rename_folder():
    folder_ = Folder(request.json.get("name"))
    folder_.rename(request.json.get("new_name"))

    return {"status": "done"}


@current_app.post("/delete_note")
def delete_note():
    Note(request.json.get("path")).delete()

    return {"status": "done"}


@current_app.post("/duplicate_note")
def duplicate_note():
    return Note(request.json.get("path")).duplicate().to_dict()


@current_app.post("/toggle_favorite")
def toggle_favorite():
    Note(request.json.get("path")).toggle_favorite()

    return {"status": "done"}


@current_app.post("/search")
def search():
    return {"results": [i.to_dict() for i in Note.search(request.json.get("query"))]}
