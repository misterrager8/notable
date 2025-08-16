import datetime
from flask import current_app, render_template, request, send_from_directory

from .models import Folder, Note


@current_app.route("/")
def index():
    return send_from_directory(current_app.static_folder, "index.html")


@current_app.post("/get_all")
def get_all():
    success = True
    msg = ""
    notes = []
    folders = []

    try:
        notes = [
            i.to_dict()
            for i in Note.all(
                filter=request.json.get("folder"), sort=request.json.get("sort")
            )
        ]
        folders = [i.to_dict() for i in Folder.all()]
    except Exception as e:
        msg = str(e)
        success = False

    return {"success": success, "msg": msg, "notes": notes, "folders": folders}


@current_app.post("/add_note")
def add_note():
    success = True
    msg = ""
    notes = []
    folders = []
    note = None

    try:
        note = Note.add(
            f"{datetime.datetime.now().strftime('%y%m%d')}, note",
            request.json.get("folder"),
        )

        notes = [
            i.to_dict()
            for i in Note.all(
                filter=request.json.get("folder"), sort=request.json.get("sort")
            )
        ]
        folders = [i.to_dict() for i in Folder.all()]
        note = note.to_dict()
    except Exception as e:
        msg = str(e)
        success = False

    return {
        "success": success,
        "msg": msg,
        "notes": notes,
        "folders": folders,
        "note": note,
    }


@current_app.post("/edit_note")
def edit_note():
    success = True
    msg = ""
    notes = []
    folders = []
    note = None

    try:
        note = Note(request.json.get("path"))
        note.edit(request.json.get("content"))

        notes = [
            i.to_dict()
            for i in Note.all(
                filter=request.json.get("folder"), sort=request.json.get("sort")
            )
        ]
        folders = [i.to_dict() for i in Folder.all()]
        note = note.to_dict()
    except Exception as e:
        msg = str(e)
        success = False

    return {
        "success": success,
        "msg": msg,
        "notes": notes,
        "folders": folders,
        "note": note,
    }


@current_app.post("/rename_note")
def rename_note():
    success = True
    msg = ""
    notes = []
    folders = []
    note = None

    try:
        note = Note(request.json.get("path")).rename(request.json.get("new_name"))

        notes = [
            i.to_dict()
            for i in Note.all(
                filter=request.json.get("folder"), sort=request.json.get("sort")
            )
        ]
        folders = [i.to_dict() for i in Folder.all()]
        note = note.to_dict()
    except Exception as e:
        msg = str(e)
        success = False

    return {
        "success": success,
        "msg": msg,
        "notes": notes,
        "folders": folders,
        "note": note,
    }


@current_app.post("/delete_note")
def delete_note():
    success = True
    msg = ""
    notes = []
    folders = []

    try:
        note = Note(request.json.get("path"))
        note.delete()

        notes = [
            i.to_dict()
            for i in Note.all(
                filter=request.json.get("folder"), sort=request.json.get("sort")
            )
        ]
        folders = [i.to_dict() for i in Folder.all()]
    except Exception as e:
        msg = str(e)
        success = False

    return {
        "success": success,
        "msg": msg,
        "notes": notes,
        "folders": folders,
    }


@current_app.post("/change_folder")
def change_folder():
    success = True
    msg = ""
    notes = []
    folders = []
    note = None

    try:
        note = Note(request.json.get("path")).change_folder(
            request.json.get("new_folder")
        )

        notes = [
            i.to_dict()
            for i in Note.all(
                filter=request.json.get("folder"), sort=request.json.get("sort")
            )
        ]
        folders = [i.to_dict() for i in Folder.all()]
        note = note.to_dict()
    except Exception as e:
        msg = str(e)
        success = False

    return {
        "success": success,
        "msg": msg,
        "notes": notes,
        "note": note,
        "folders": folders,
    }


@current_app.post("/toggle_bookmark")
def toggle_bookmark():
    success = True
    msg = ""
    notes = []
    folders = []
    note = None

    try:
        note = Note(request.json.get("path"))
        note.toggle_favorite()

        notes = [
            i.to_dict()
            for i in Note.all(
                filter=request.json.get("folder"), sort=request.json.get("sort")
            )
        ]
        folders = [i.to_dict() for i in Folder.all()]
        note = note.to_dict()
    except Exception as e:
        msg = str(e)
        success = False

    return {
        "success": success,
        "msg": msg,
        "notes": notes,
        "folders": folders,
        "note": note,
    }


@current_app.post("/rename_folder")
def rename_folder():
    success = True
    msg = ""
    notes = []
    folders = []

    try:
        folder = Folder(request.json.get("name"))
        folder.rename(request.json.get("new_name"))

        notes = [
            i.to_dict()
            for i in Note.all(
                filter=request.json.get("folder"), sort=request.json.get("sort")
            )
        ]
        folders = [i.to_dict() for i in Folder.all()]

    except Exception as e:
        msg = str(e)
        success = False

    return {
        "success": success,
        "msg": msg,
        "notes": notes,
        "folders": folders,
    }


@current_app.post("/add_folder")
def add_folder():
    success = True
    msg = ""
    notes = []
    folders = []
    folder = None

    try:
        folder = Folder.add(f"{datetime.datetime.now().strftime('%y%m%d')}, folder")

        notes = [
            i.to_dict()
            for i in Note.all(filter=folder.name, sort=request.json.get("sort"))
        ]
        folders = [i.to_dict() for i in Folder.all()]
        folder = folder.to_dict()
    except Exception as e:
        msg = str(e)
        success = False

    return {
        "success": success,
        "msg": msg,
        "notes": notes,
        "folders": folders,
        "folder": folder,
    }


@current_app.post("/delete_folder")
def delete_folder():
    success = True
    msg = ""
    notes = []
    folders = []

    try:
        folder = Folder(request.json.get("name"))
        folder.delete()

        notes = [
            i.to_dict()
            for i in Note.all(
                filter=request.json.get("folder"), sort=request.json.get("sort")
            )
        ]
        folders = [i.to_dict() for i in Folder.all()]

    except Exception as e:
        msg = str(e)
        success = False

    return {
        "success": success,
        "msg": msg,
        "notes": notes,
        "folders": folders,
    }
