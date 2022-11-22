import datetime

from flask import Blueprint, redirect, render_template, request, url_for

from mdlab import config
from mdlab.models import Memo

memos = Blueprint("memos", __name__)


@memos.route("/memos_")
def memos_():
    return render_template("memos.html")


@memos.route("/create_memo", methods=["POST"])
def create_memo():
    name_ = (
        request.form.get("name")
        or f"Memo #{datetime.datetime.now().strftime('%y%m%d%H%M%S')}"
    )
    memo_ = Memo(config.HOME_DIR / request.args.get("folder") / f"{name_}.txt")
    memo_.create()

    return redirect(url_for("memos.memo", folder=memo_.folder.name, name=memo_.name))


@memos.route("/memo")
def memo():
    memo_ = Memo(
        config.HOME_DIR / request.args.get("folder") / request.args.get("name")
    )

    return render_template("memo.html", memo_=memo_)


@memos.route("/get_text")
def get_text():
    return Memo(
        config.HOME_DIR / request.args.get("folder") / request.args.get("name")
    ).text


@memos.route("/edit_memo", methods=["POST"])
def edit_memo():
    memo_ = Memo(
        config.HOME_DIR / request.form.get("folder") / request.form.get("name")
    )
    memo_.edit(request.form.get("content"))

    return redirect(request.referrer)


@memos.route("/rename_memo", methods=["POST"])
def rename_memo():
    memo_ = Memo(
        config.HOME_DIR / request.args.get("folder") / request.args.get("name")
    )
    memo_.rename(
        config.HOME_DIR / request.form.get("folder") / f"{request.form.get('name')}.txt"
    )

    return redirect(
        url_for(
            "memos.memo",
            folder=request.form.get("folder"),
            name=f"{request.form.get('name')}.txt",
        )
    )


@memos.route("/publish_memo")
def publish_memo():
    memo_ = Memo(
        config.HOME_DIR / request.args.get("folder") / request.args.get("name")
    )
    published = memo_.publish()

    return redirect(
        url_for(
            "notes.note",
            folder=published.folder.name,
            name=published.name,
        )
    )


@memos.route("/delete_memo")
def delete_memo():
    memo_ = Memo(
        config.HOME_DIR / request.args.get("folder") / request.args.get("name")
    )
    folder_ = memo_.folder.name
    memo_.delete()

    return redirect(url_for("folders.folder", name=folder_))
