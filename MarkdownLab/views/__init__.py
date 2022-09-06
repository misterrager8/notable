from pathlib import Path

from flask import current_app, render_template


@current_app.context_processor
def get_folders():
    base_dir = Path(current_app.config["BASE_DIR"])
    return {"folders": [i for i in list(base_dir.iterdir()) if i.is_dir()]}


@current_app.route("/")
def index():
    return render_template("index.html")
