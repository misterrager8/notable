import os
from flask import current_app
import markdown


class Folder:
    def __init__(self, name: str):
        self.name = name

    def get_files(self):
        return [
            File(i, self.name)
            for i in os.listdir(current_app.config["MAIN_FOLDER"] + self.name)
            if os.path.isfile(current_app.config["MAIN_FOLDER"] + self.name + "/" + i)
            and ".md" in i
        ]


class File:
    def __init__(self, name: str, folder: str):
        self.name = name
        self.folder = folder

    def get_content(self, md: bool = False):
        with open(
            "%s%s/%s" % (current_app.config["MAIN_FOLDER"], self.folder, self.name), "r"
        ) as f:
            content = markdown.markdown(f.read()) if md else f.read()

        return content
