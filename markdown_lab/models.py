import datetime
import shutil
from pathlib import Path

import markdown

from markdown_lab import config


class Folder:
    def __init__(self, path: str):
        self.path = Path(path)

    def create(self):
        self.path.mkdir()

    def rename(self, new_name):
        self.path = self.path.rename(Path(config.BASE_DIR) / new_name)

    def delete(self):
        shutil.rmtree(self.path)

    @classmethod
    def all(cls):
        return [Folder(i) for i in list(Path(config.BASE_DIR).iterdir()) if i.is_dir()]

    @property
    def files(self):
        return sorted(
            [File(i) for i in self.path.iterdir() if i.is_file() and ".md" in i.name],
            key=lambda x: x.last_modified,
            reverse=True,
        )

    @property
    def name(self):
        return self.path.stem

    @property
    def date_created(self):
        return datetime.datetime.fromtimestamp(self.path.stat().st_birthtime)


class File:
    def __init__(self, path: str):
        self.path = Path(path)

    def create(self):
        self.path.touch()

    def rename(self, new_path):
        self.path = self.path.rename(new_path)

    def delete(self):
        self.path.unlink()

    @classmethod
    def all(cls):
        return sorted(
            [File(i) for i in Path(config.BASE_DIR).glob("**/*.md")],
            key=lambda x: x.last_modified,
            reverse=True,
        )

    @property
    def folder(self):
        return Folder(self.path.parent)

    @property
    def text(self):
        return open(self.path).read()

    @property
    def markdown(self):
        return markdown.markdown(open(self.path).read())

    @property
    def name(self):
        return self.path.stem

    @property
    def name_ext(self):
        return self.path.name

    @property
    def date_created(self):
        return datetime.datetime.fromtimestamp(self.path.stat().st_birthtime)

    @property
    def last_modified(self):
        return datetime.datetime.fromtimestamp(self.path.stat().st_mtime)

    @property
    def favorited(self):
        return str(self.path) in open(Path(config.BASE_DIR) / "favorites.txt").read()
