import os
from markdownManager.models import Folder


class Handler:
    def __init__(self):
        pass

    def get_folders(self):
        return [
            Folder(i) for i in os.listdir("notes/") if os.path.isdir("notes/%s" % i)
        ]
