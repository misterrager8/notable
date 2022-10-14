import datetime
from pathlib import Path

from flask import Blueprint, redirect, render_template, request, url_for

from markdown_lab import config, saver
from markdown_lab.models import File

files = Blueprint("files", __name__)


@files.route("/create_file", methods=["POST"])
def create_file():
    file_ = File(
        config.BASE_DIR
        / request.args.get("folder")
        / ((request.form["name"] or "Untitled File") + ".md")
    )
    file_.create()
    return redirect(
        url_for("files.editor", folder=request.args.get("folder"), file=file_.name_ext)
    )


@files.route("/quick_file")
def quick_file():
    file_ = File(
        config.BASE_DIR
        / "Misc"
        / f"{datetime.datetime.now().strftime('%m-%d-%y %I%M%p')}.md"
    )
    file_.create()
    return redirect(
        url_for("files.editor", folder=file_.folder.name, file=file_.name_ext)
    )


@files.route("/save_link", methods=["POST"])
def save_link():
    url = request.form["url"]

    file_ = File(
        config.BASE_DIR / request.args.get("folder") / (saver.get_title(url) + ".md")
    )
    file_.create()
    with open(file_.path, "w") as f:
        f.write(saver.get_html2text(url))

    return redirect(
        url_for("files.editor", folder=file_.folder.name, file=file_.name_ext)
    )


@files.route("/editor")
def editor():
    file_ = File(
        config.BASE_DIR / request.args.get("folder") / request.args.get("file")
    )
    return render_template("editor.html", file_=file_)


@files.route("/edit_note", methods=["POST"])
def edit_note():
    file_ = File(config.BASE_DIR / request.form["folder"] / request.form["file"])
    with open(file_.path, "w") as f:
        f.write(request.form["content"])

    return redirect(request.referrer)


@files.route("/file")
def file():
    file_ = File(
        config.BASE_DIR / request.args.get("folder") / request.args.get("file")
    )
    return render_template("file.html", file_=file_)


@files.route("/favorites")
def favorites():
    return render_template(
        "favorites.html", favs=[i for i in File.all() if i.favorited]
    )


@files.route("/clear_favorites")
def clear_favorites():
    open(config.BASE_DIR / "favorites.txt", "w").write("")

    return redirect(request.referrer)


@files.route("/favorite_file")
def favorite_file():
    path = request.args.get("path")
    favs_ = config.BASE_DIR / "favorites.txt"
    if not path in open(favs_).read():
        open(favs_, "a").write(path + "\n")
    else:
        f = open(favs_).read()
        open(favs_, "w").write(f.replace(path + "\n", ""))
    return redirect(request.referrer)


@files.route("/delete_file")
def delete_file():
    file_ = File(
        config.BASE_DIR / request.args.get("folder") / request.args.get("file")
    )
    folder_ = file_.path.parent
    file_.delete()

    return redirect(url_for("folders.folder", name=folder_.name))


@files.route("/rename_file", methods=["POST"])
def rename_file():
    file_ = File(request.args.get("path"))
    file_.rename(
        config.BASE_DIR / request.form["folder"] / (request.form["name"] + ".md")
    )

    return redirect(
        url_for("files.editor", folder=file_.folder.name, file=file_.name_ext)
    )
