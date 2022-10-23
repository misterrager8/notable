from flask import current_app, render_template

from markdown_lab.models import File, Folder


@current_app.context_processor
def get_folders():
    return {"folders": Folder.all()}


@current_app.context_processor
def get_files():
    return {"files": File.all()}


@current_app.route("/")
def index():
    return render_template("index.html")


@current_app.route("/quickies")
def quickies():
    return render_template("quickies.html", quickies=File.quickies())
