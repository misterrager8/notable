import datetime
from bs4 import BeautifulSoup

from flask import current_app, render_template, request
import html2text
import requests

from mdlab.models import Note


@current_app.get("/")
def index():
    return render_template("index.html")


@current_app.post("/notes")
def notes():
    sort = request.json.get("sort")
    return {"notes": [i.to_dict() for i in Note.all(sort=sort)]}


@current_app.post("/tags")
def tags():
    return {"tags": list(set([i.tag for i in Note.all()]))}


@current_app.post("/filter_by_tag")
def filter_by_tag():
    tag_ = request.json.get("tag")
    return {"notes": [i.to_dict() for i in Note.all() if i.tag == tag_]}


@current_app.post("/add_note")
def add_note():
    note_ = Note.add(f"Note {datetime.datetime.now().strftime('%H%m%s')}")

    return note_.to_dict()


@current_app.post("/note")
def note():
    note_ = Note(request.json.get("name"))

    return note_.to_dict()


@current_app.post("/edit_note")
def edit_note():
    note_ = Note(request.json.get("name"))
    note_.edit(request.json.get("content"))

    return note_.to_dict()


@current_app.post("/save_page")
def save_page():
    soup = BeautifulSoup(requests.get(request.json.get("url")).text, "html.parser")
    title = soup.find("title").get_text()

    note_ = Note.add(title)
    note_.edit(html2text.html2text(str(soup), bodywidth=0))

    return note_.to_dict()


@current_app.post("/rename_note")
def rename_note():
    note_ = Note(request.json.get("name"))

    return note_.rename(request.json.get("new_name")).to_dict()


@current_app.post("/delete_note")
def delete_note():
    Note(request.json.get("name")).delete()

    return {"status": "done"}


@current_app.post("/toggle_favorite")
def toggle_favorite():
    Note(request.json.get("name")).toggle_favorite()

    return {"status": "done"}


@current_app.post("/edit_tag")
def edit_tag():
    note_ = Note(request.json.get("name"))
    note_.edit_tag(request.json.get("new_tag"))

    return note_.to_dict()


@current_app.post("/search")
def search():
    return {"results": [i.to_dict() for i in Note.search(request.json.get("query"))]}
