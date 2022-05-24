import os


class Note:
    def __init__(self, title: str, folder: str = "Unsorted"):
        self.title = title
        self.folder = folder
        self.path = "notes/%s/%s.md" % (self.folder, self.title)


class Folder:
    def __init__(self, name_: str):
        self.name_ = name_

    def get_notes(self):
        return [
            Note(i.strip(".md"), self.name_)
            for i in os.listdir("notes/%s/" % self.name_)
            if ".md" in i
        ]
