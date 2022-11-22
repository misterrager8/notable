import datetime
import operator
import shutil
from pathlib import Path

import markdown

from mdlab import config


class Folder(object):
    def __init__(self, path: Path):
        self.path = path

    @classmethod
    def all(cls) -> list:
        return [Folder(i) for i in config.HOME_DIR.iterdir() if i.is_dir()]

    @property
    def name(self) -> str:
        return self.path.name

    @property
    def notes(self, sort: str = "last_modified", reverse: bool = True) -> list:
        return sorted(
            [Note(i) for i in self.path.iterdir() if i.is_file() and i.suffix == ".md"],
            key=operator.attrgetter(sort),
            reverse=reverse,
        )

    def create(self):
        self.path.mkdir()

    def rename(self, new_name: Path):
        self.path.rename(new_name)

    def delete(self):
        shutil.rmtree(self.path)


class Note(object):
    def __init__(self, path: Path):
        self.path = path

    @classmethod
    def all(cls, sort: str = "last_modified", reverse: bool = True) -> list:
        return sorted(
            [Note(i) for i in config.HOME_DIR.glob("**/*.md")],
            key=operator.attrgetter(sort),
            reverse=reverse,
        )

    @classmethod
    def favorites(cls) -> list:
        return [
            Note(Path(i.strip()))
            for i in open(config.HOME_DIR / "favorites.txt").readlines()
            if i.strip()
        ]

    @property
    def name(self) -> str:
        return self.path.name

    @property
    def favorited(self) -> bool:
        return str(self.path) in open(config.HOME_DIR / "favorites.txt").read()

    @property
    def stem(self) -> str:
        return self.path.stem

    @property
    def folder(self) -> Folder:
        return Folder(self.path.parent)

    @property
    def text(self) -> str:
        return open(self.path).read()

    @property
    def markdown(self) -> str:
        return markdown.markdown(self.text)

    @property
    def date_created(self) -> datetime.datetime:
        return datetime.datetime.fromtimestamp(self.path.stat().st_birthtime)

    @property
    def last_modified(self) -> datetime.datetime:
        return datetime.datetime.fromtimestamp(self.path.stat().st_mtime)

    def create(self):
        self.path.touch()

    def edit(self, content: str):
        open(self.path, "w").write(content)

    def toggle_favorite(self):
        favs = open(config.HOME_DIR / "favorites.txt").read()
        if self.favorited:
            open((config.HOME_DIR / "favorites.txt"), "w").write(
                favs.replace(f"{self.path}\n", "")
            )
        else:
            open((config.HOME_DIR / "favorites.txt"), "a").write(f"{self.path}\n")

    def rename(self, new_name: Path):
        self.path.rename(new_name)

    def delete(self):
        self.path.unlink()


class Memo(object):
    def __init__(self, path: Path):
        self.path = path

    @classmethod
    def all(cls, sort: str = "last_modified", reverse: bool = True) -> list:
        return sorted(
            [
                Memo(i)
                for i in config.HOME_DIR.glob("**/*.txt")
                if i.name != "favorites.txt"
            ],
            key=operator.attrgetter(sort),
            reverse=reverse,
        )

    @property
    def name(self) -> str:
        return self.path.name

    @property
    def stem(self) -> str:
        return self.path.stem

    @property
    def folder(self) -> Folder:
        return Folder(self.path.parent)

    @property
    def text(self) -> str:
        return open(self.path).read()

    @property
    def date_created(self) -> datetime.datetime:
        return datetime.datetime.fromtimestamp(self.path.stat().st_birthtime)

    @property
    def last_modified(self) -> datetime.datetime:
        return datetime.datetime.fromtimestamp(self.path.stat().st_mtime)

    def create(self):
        self.path.touch()

    def edit(self, content: str):
        open(self.path, "w").write(content)

    def rename(self, new_name: Path):
        self.path.rename(new_name)

    def publish(self):
        _ = Note(config.HOME_DIR / self.folder.name / f"{self.stem}.md")
        _.create()
        _.edit(self.text)
        return _

    def delete(self):
        self.path.unlink()
