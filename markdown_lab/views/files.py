from pathlib import Path

import markdown
from flask import Blueprint, redirect, render_template, request, url_for

from markdown_lab import config, saver
from markdown_lab.models import File

files = Blueprint("files", __name__)


@files.route("/create_file", methods=["POST"])
def create_file():
    file_ = Path(request.args.get("parent")) / (
        (request.form["name"] or "Untitled File") + ".md"
    )
    file_.touch()
    return redirect(url_for("files.editor", path=file_))


@files.route("/save_link", methods=["POST"])
def save_link():
    parent = Path(request.args.get("parent"))
    url = request.form["url"]

    file_ = parent / (saver.get_title(url) + ".md")
    file_.touch()
    with open(file_, "w") as f:
        f.write(saver.get_html2text(url))

    return redirect(url_for("files.editor", path=file_))


@files.route("/editor", methods=["POST", "GET"])
def editor():
    file_ = Path(request.args.get("path"))
    if request.method == "GET":
        return render_template("editor.html", file_=file_)
    else:
        with open(file_, "w") as f:
            f.write(request.form["content"])

        return redirect(request.referrer)


@files.route("/file")
def file():
    file_ = File(Path(request.args.get("path")))
    with open(file_.path) as f:
        content = markdown.markdown(f.read())
    return render_template("file.html", file_=file_, content=content)


@files.route("/favorite_file")
def favorite_file():
    path = request.args.get("path")
    favs_ = Path(config.BASE_DIR) / "favorites.txt"
    if not path in open(favs_).read():
        open(favs_, "a").write(path + "\n")
    else:
        f = open(favs_).read()
        open(favs_, "w").write(f.replace(path + "\n", ""))
    return redirect(request.referrer)


@files.route("/delete_file")
def delete_file():
    file_ = File(Path(request.args.get("path")))
    parent = file_.path.parent
    file_.path.unlink()

    return redirect(url_for("folders.folder", path=parent))


@files.route("/rename_file", methods=["POST"])
def rename_file():
    file_ = Path(request.args.get("path"))
    file_ = file_.rename(file_.parent / request.form["name"])

    return redirect(url_for("files.file", path=file_))
