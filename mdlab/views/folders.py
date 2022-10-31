from flask import Blueprint, redirect, request

from mdlab import config
from mdlab.models import Folder

folders = Blueprint("folders", __name__)


@folders.route("/get_folder")
def get_folder():
    folder_ = Folder(config.HOME_DIR / request.args.get("name"))
    return dict(notes=[i.to_dict() for i in folder_.notes])


@folders.route("/create_folder", methods=["POST"])
def create_folder():
    folder_ = Folder(config.HOME_DIR / request.form.get("name"))
    folder_.create()

    return redirect(request.referrer)


@folders.route("/delete_folder")
def delete_folder():
    folder_ = Folder(config.HOME_DIR / request.args.get("name"))
    folder_.delete()

    return redirect(request.referrer)
