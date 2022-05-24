from flask import Flask, render_template, redirect, request, current_app
import markdown
import os
import datetime
from markdownManager.models import Note, Folder
from markdownManager.ctrla import Handler
import shutil

handler = Handler()


@current_app.route("/")
def index():
    x = []
    for i in handler.get_folders():
        for j in i.get_notes():
            x.append(j)

    return render_template("index.html", x=x)


@current_app.route("/note")
def note():
    note_ = Note(request.args.get("filename"), request.args.get("dirname"))
    with open(note_.path) as f:
        content = f.read()
    return render_template(
        "note.html", content=content, note_=note_, md=markdown.markdown(content)
    )


@current_app.route("/folder_")
def folder_():
    folder_ = Folder(request.args.get("dirname"))
    return render_template("folder.html", folder_=folder_)


@current_app.route("/folders")
def folders():
    folders_ = handler.get_folders()
    return render_template("folders.html", folders_=folders_)


@current_app.route("/add_note", methods=["POST"])
def add_note():
    new_note = request.form["new_note"]
    with open("notes/Unsorted/%s.md" % new_note.title(), "x") as f:
        f.write("title: %s\n" % new_note.title())
        f.write("date_created: %s\n\n" % datetime.datetime.now().strftime("%F"))
    return redirect(request.referrer)


@current_app.route("/add_note_to_folder", methods=["POST"])
def add_note_to_folder():
    new_note = request.form["new_note"]
    dirname = request.form["dirname"]
    with open("notes/%s/%s.md" % (dirname, new_note.title()), "x") as f:
        f.write("title: %s\n" % new_note.title())
        f.write("date_created: %s\n\n" % datetime.datetime.now().strftime("%F"))
    return redirect(request.referrer)


@current_app.route("/edit_note", methods=["POST"])
def edit_note():
    with open(request.form["filename"], "w") as f:
        f.write(request.form["editor"])

    return redirect(request.referrer)


@current_app.route("/preview_note", methods=["POST"])
def preview_note():
    editor = request.form["editor"]
    return markdown.markdown(editor)


@current_app.route("/delete_note")
def delete_note():
    os.remove(request.args.get("filename"))
    return redirect(request.referrer)


@current_app.route("/add_folder", methods=["POST"])
def add_folder():
    new_folder = request.form["new_folder"]
    os.mkdir("notes/%s" % new_folder.title())
    return redirect(request.referrer)


@current_app.route("/delete_folder")
def delete_folder():
    shutil.rmtree("notes/%s" % request.args.get("dirname"))
    return redirect(request.referrer)
