from pathlib import Path

from flask import Blueprint, redirect, render_template, request, url_for

from markdown_lab import config, saver
from markdown_lab.models import File

files = Blueprint("files", __name__)


@files.route("/create_file", methods=["POST"])
def create_file():
    file_ = File(
        Path(request.args.get("parent"))
        / ((request.form["name"] or "Untitled File") + ".md")
    )
    file_.create()
    return redirect(url_for("files.editor", path=file_.path))


@files.route("/save_link", methods=["POST"])
def save_link():
    parent = Path(request.args.get("parent"))
    url = request.form["url"]

    file_ = File(parent / (saver.get_title(url) + ".md"))
    file_.create()
    with open(file_.path, "w") as f:
        f.write(saver.get_html2text(url))

    return redirect(url_for("files.editor", path=file_.path))


@files.route("/editor", methods=["POST", "GET"])
def editor():
    file_ = File(request.args.get("path"))
    if request.method == "GET":
        return render_template("editor.html", file_=file_)
    else:
        with open(file_.path, "w") as f:
            f.write(request.form["content"])

        return redirect(request.referrer)


@files.route("/file")
def file():
    file_ = File(request.args.get("path"))
    return render_template("file.html", file_=file_)


@files.route("/favorites")
def favorites():
    return render_template(
        "favorites.html", favs=[i for i in File.all() if i.favorited]
    )


@files.route("/clear_favorites")
def clear_favorites():
    open(Path(config.BASE_DIR) / "favorites.txt", "w").write("")

    return redirect(request.referrer)


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
    file_ = File(request.args.get("path"))
    parent = file_.path.parent
    file_.delete()

    return redirect(url_for("folders.folder", path=parent))


@files.route("/rename_file", methods=["POST"])
def rename_file():
    file_ = File(request.args.get("path"))
    file_.rename(
        Path(config.BASE_DIR) / request.form["folder"] / (request.form["name"] + ".md")
    )

    return redirect(url_for("files.editor", path=file_.path))
