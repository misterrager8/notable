from flask import Blueprint, redirect, render_template, request, url_for

from mdlab import config
from mdlab.models import Folder

folders = Blueprint("folders", __name__)


@folders.route("/create_folder", methods=["POST"])
def create_folder():
    folder_ = Folder(config.HOME_DIR / request.form.get("name"))
    folder_.create()

    return redirect(url_for("folders.folder", name=folder_.name))


@folders.route("/folder")
def folder():
    folder_ = Folder(config.HOME_DIR / request.args.get("name"))

    return render_template("folder.html", folder_=folder_)


@folders.route("/rename_folder", methods=["POST"])
def rename_folder():
    folder_ = Folder(config.HOME_DIR / request.args.get("name"))
    folder_.rename(config.HOME_DIR / request.form.get("name"))

    return redirect(url_for("folders.folder", name=request.form.get("name")))


@folders.route("/delete_folder")
def delete_folder():
    folder_ = Folder(config.HOME_DIR / request.args.get("name"))
    folder_.delete()

    return redirect(url_for("index"))
