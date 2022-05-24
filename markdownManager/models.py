import os
import markdown


class Note:
    def __init__(self, title: str, folder: str = "Unsorted"):
        self.title = title
        self.folder = folder
        self.path = "notes/%s/%s.md" % (self.folder, self.title)

    def get_txt(self):
        with open(self.path) as f:
            txt = f.read()
        return txt

    def get_md(self):
        with open(self.path) as f:
            txt = f.read()
        return markdown.markdown(txt)


class Folder:
    def __init__(self, name_: str):
        self.name_ = name_

    def get_notes(self):
        return [
            Note(i.strip(".md"), self.name_)
            for i in os.listdir("notes/%s/" % self.name_)
            if ".md" in i
        ]
