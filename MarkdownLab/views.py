from flask import current_app, render_template, request, redirect, url_for
import markdown
import os
from MarkdownLab.models import Folder, File


@current_app.context_processor
def get_folders():
    return {
        "folders": [
            Folder(i)
            for i in os.listdir(current_app.config["MAIN_FOLDER"])
            if os.path.isdir(current_app.config["MAIN_FOLDER"] + i)
        ]
    }


@current_app.route("/")
def index():
    return render_template("index.html")


@current_app.route("/create_folder", methods=["POST"])
def create_folder():
    name_ = request.form["name"]
    os.mkdir(current_app.config["MAIN_FOLDER"] + name_)

    return redirect(url_for("folder", dirname=name_))


@current_app.route("/folder")
def folder():
    folder_ = Folder(request.args.get("dirname"))
    return render_template("folder.html", folder_=folder_)


@current_app.route("/delete_folder")
def delete_folder():
    path_ = current_app.config["MAIN_FOLDER"] + request.args.get("dirname")
    os.rmdir(path_)

    return redirect(url_for("index"))


@current_app.route("/create_file", methods=["POST"])
def create_file():
    name_ = request.form["name"] + ".md"
    with open(
        "%s%s/%s"
        % (current_app.config["MAIN_FOLDER"], request.args.get("folder"), name_),
        "w",
    ) as f:
        pass

    return redirect(url_for("editor", name=name_, folder=request.args.get("folder")))


@current_app.route("/editor", methods=["POST", "GET"])
def editor():
    file_ = File(request.args.get("name"), request.args.get("folder"))
    path_ = "%s%s/%s" % (current_app.config["MAIN_FOLDER"], file_.folder, file_.name)
    if request.method == "GET":
        return render_template("editor.html", file_=file_)
    else:
        with open(path_, "w") as f:
            f.write(request.form["content"])
        return redirect(request.referrer)


@current_app.route("/preview_content")
def preview_content():
    return markdown.markdown(request.args.get("content"))


@current_app.route("/delete_file")
def delete_file():
    file_ = File(request.args.get("name"), request.args.get("folder"))
    path_ = "%s%s/%s" % (current_app.config["MAIN_FOLDER"], file_.folder, file_.name)
    os.remove(path_)

    return redirect(url_for("folder", dirname=request.args.get("folder")))
