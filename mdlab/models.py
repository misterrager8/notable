import datetime
import shutil
from pathlib import Path

import markdown

from mdlab import config


class Folder(object):
    def __init__(self, path: Path):
        self.path = path

    @classmethod
    def all(cls):
        return [Folder(i) for i in config.HOME_DIR.iterdir() if i.is_dir()]

    def create(self):
        self.path.mkdir()

    def delete(self):
        shutil.rmtree(self.path)

    @property
    def notes(self):
        return [
            Note(i) for i in self.path.iterdir() if i.is_file() and i.suffix == ".md"
        ]


class Note(object):
    def __init__(self, path: Path):
        self.path = path

    @classmethod
    def all(cls):
        return [Note(i) for i in config.HOME_DIR.glob("**/*.md")]

    @classmethod
    def favorites(cls):
        return [
            Note(Path(i.strip()))
            for i in open(config.HOME_DIR / "favorites.txt").read().split("\n")
            if i.strip()
        ]

    def create(self):
        self.path.touch()

    def delete(self):
        self.path.unlink()

    @property
    def text(self):
        return open(self.path).read()

    @property
    def markdown(self):
        return markdown.markdown(self.text)

    @property
    def last_modified(self):
        return datetime.datetime.fromtimestamp(self.path.stat().st_mtime)

    @property
    def favorited(self):
        return str(self.path) in open(config.HOME_DIR / "favorites.txt").read()

    def toggle_favorite(self):
        favs = open(config.HOME_DIR / "favorites.txt").read()
        if self.favorited:
            open(config.HOME_DIR / "favorites.txt", "w").write(
                favs.replace(f"{self.path}\n", "")
            )
        else:
            open(config.HOME_DIR / "favorites.txt", "a").write(f"{self.path}\n")

    def edit(self, text: str):
        open(self.path, "w").write(text)

    def to_dict(self):
        return dict(
            name=self.path.stem,
            text=self.text,
            markdown=self.markdown,
            last_modified=self.last_modified.strftime("%B %-d, %Y"),
            folder=self.path.parent.name,
            favorited=int(self.favorited == True),
        )
