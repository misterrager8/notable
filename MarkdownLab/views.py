from flask import current_app, render_template, request, redirect, url_for
from pathlib import Path
import markdown


@current_app.context_processor
def get_folders():
    base_dir = Path(current_app.config["BASE_DIR"])
    return {"folders": [i for i in list(base_dir.iterdir()) if i.is_dir()]}


@current_app.route("/")
def index():
    return render_template("index.html")


@current_app.route("/create_folder", methods=["POST"])
def create_folder():
    folder_ = Path(request.args.get("parent")) / request.form["name"]
    folder_.mkdir()
    return redirect(url_for("folder", path=folder_))


@current_app.route("/create_file", methods=["POST"])
def create_file():
    file_ = Path(request.args.get("parent")) / (request.form["name"] + ".md")
    file_.touch()
    return redirect(url_for("file", path=file_))


@current_app.route("/editor", methods=["POST", "GET"])
def editor():
    file_ = Path(request.args.get("path"))
    if request.method == "GET":
        return render_template("editor.html", file_=file_)
    else:
        with open(file_, "w") as f:
            f.write(request.form["content"])

        return redirect(request.referrer)


@current_app.route("/folder")
def folder():
    folder_ = Path(request.args.get("path"))
    return render_template("folder.html", folder_=folder_)


@current_app.route("/delete_folder")
def delete_folder():
    folder_ = Path(request.args.get("path"))
    parent = folder_.parent
    folder_.rmdir()

    if parent == Path(current_app.config["BASE_DIR"]):
        return redirect(url_for("index"))
    else:
        return redirect(url_for("folder", path=parent))


@current_app.route("/file")
def file():
    file_ = Path(request.args.get("path"))
    with open(file_) as f:
        content = markdown.markdown(f.read())
    return render_template("file.html", file_=file_, content=content)


@current_app.route("/delete_file")
def delete_file():
    file_ = Path(request.args.get("path"))
    parent = file_.parent
    file_.unlink()

    return redirect(url_for("folder", path=parent))
