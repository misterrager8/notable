from flask import current_app, render_template

from mdlab.models import Folder


@current_app.route("/")
def index():
    return render_template("index.html", folders=Folder.all())
