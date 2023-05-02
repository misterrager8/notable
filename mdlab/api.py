import datetime

import html2text
import requests
from bs4 import BeautifulSoup
from flask import Response, request, render_template

from flask import current_app as app
from .models import Folder, Note


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/create_folder")
def create_folder():
    return Folder.create(
        f"Folder {datetime.datetime.now().strftime('%H%M%S')}"
    ).to_dict()


@app.get("/folder")
def folder():
    return Folder(request.args.get("name")).to_dict()


@app.post("/rename_folder")
def rename_folder():
    folder_ = Folder(request.form.get("name"))
    return folder_.rename(request.form.get("new_name")).to_dict()


@app.get("/folders")
def folders():
    return {"folders": [i.to_dict() for i in Folder.all()]}


@app.get("/delete_folder")
def delete_folder():
    Folder(request.args.get("name")).delete()

    return {"folders": [i.to_dict() for i in Folder.all()]}


@app.get("/create_note")
def create_note():
    return Note.create(
        request.args.get("folder"),
        f"Note {datetime.datetime.now().strftime('%H%M%S')}.md",
    ).to_dict()


@app.post("/save_page")
def save_page():
    soup = BeautifulSoup(requests.get(request.form.get("url")).text, "html.parser")
    title = soup.find("title").get_text()

    note_ = Note.create(request.form.get("folder"), f"{title}.md")
    note_.edit(html2text.html2text(str(soup), bodywidth=0))

    return note_.to_dict()


@app.post("/edit_note")
def edit_note():
    note_ = Note(request.form.get("folder"), f"{request.form.get('name')}")
    note_.edit(request.form.get("content"))

    return note_.to_dict()


@app.post("/rename_note")
def rename_note():
    note_ = Note(request.form.get("folder"), request.form.get("name"))
    return note_.rename(
        f"{request.form.get('new_name')}{request.form.get('new_suffix')}"
    ).to_dict()


@app.get("/note")
def note():
    return Note(request.args.get("folder"), f"{request.args.get('name')}").to_dict()


@app.get("/favorites")
def favorites():
    return dict(favorites_=[i.to_dict() for i in Note.favorites()])


@app.get("/toggle_favorite")
def toggle_favorite():
    note_ = Note(request.args.get("folder"), f"{request.args.get('name')}")
    note_.toggle_favorite()

    return note_.to_dict()


@app.get("/delete_note")
def delete_note():
    Note(request.args.get("folder"), request.args.get("name")).delete()

    return Response(status=200)
