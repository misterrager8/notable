from pathlib import Path

from flask import Blueprint, redirect, render_template, request, url_for

from MarkdownLab import config

folders = Blueprint("folders", __name__)


@folders.route("/create_folder", methods=["POST"])
def create_folder():
    folder_ = Path(config.BASE_DIR) / request.form["name"]
    folder_.mkdir()
    return redirect(url_for("folders.folder", path=folder_))


@folders.route("/folder")
def folder():
    folder_ = Path(request.args.get("path"))
    return render_template("folder.html", folder_=folder_)


@folders.route("/delete_folder")
def delete_folder():
    folder_ = Path(request.args.get("path"))
    folder_.rmdir()

    return redirect(url_for("index"))


@folders.route("/rename_folder", methods=["POST"])
def rename_folder():
    folder_ = Path(request.args.get("path"))
    folder_ = folder_.rename(Path(config.BASE_DIR) / request.form["name"])

    return redirect(url_for("folders.folder", path=folder_))
