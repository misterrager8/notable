import datetime
import pathlib
import shutil
import subprocess
from operator import attrgetter
from pathlib import Path

import frontmatter
import markdown

from . import config


def check_duplicate(name: str, list_of_names: list) -> str:
    """Check if a filename is found. If true, return filename with an int appended to the end. Return original name if false."""
    name = name.strip()
    if name in list_of_names:
        if (name[-1]).isdigit():
            num = int(name[-1])
            return check_duplicate(name[:-1] + f"{str(num + 1)}", list_of_names)
        else:
            return check_duplicate(f"{name} 2", list_of_names)
    else:
        return name


class Note:
    """Note object."""

    def __init__(self, path):
        self.path = pathlib.Path(path)

    @property
    def frontmatter(self):
        _ = frontmatter.load(self.path)
        if not frontmatter.check(self.path):
            _.metadata.update({"favorited": False})

        return _

    @property
    def name(self):
        return self.path.stem

    @property
    def content(self):
        return self.frontmatter.content

    @property
    def favorited(self):
        return self.frontmatter.get("favorited")

    @property
    def folder(self):
        x = self.path.parent
        if x == config.HOME_DIR:
            return None
        else:
            return self.path.parent.name

    @property
    def date_created(self) -> datetime.datetime:
        return datetime.datetime.fromtimestamp(self.path.stat().st_birthtime)

    @property
    def last_modified(self) -> datetime.datetime:
        return datetime.datetime.fromtimestamp(self.path.stat().st_mtime)

    @classmethod
    def add(cls, name: str, folder: str = None):
        name = check_duplicate(name, [i.name for i in Note.all()])
        path_ = (
            config.HOME_DIR / folder / f"{name}.txt"
            if folder
            else config.HOME_DIR / f"{name}.txt"
        )
        _ = Note(path_)
        _.path.touch()

        return _

    def delete(self):
        self.path.unlink()

    def fixup_title(self):
        return self.rename(self.name.title())

    def toggle_favorite(self):
        _ = self.frontmatter
        _.metadata.update({"favorited": not _.metadata.get("favorited")})
        self.edit_frontmatter(_)

    def edit(self, content: str):
        _ = self.frontmatter
        _.content = content
        self.edit_frontmatter(_)

    def rename(self, new_name: str):
        new_path = (
            config.HOME_DIR / f"{new_name}.txt"
            if not self.folder
            else config.HOME_DIR / self.folder / f"{new_name}.txt"
        )
        self.path.rename(new_path)

        return Note(new_path)

    def change_folder(self, new_folder: str = None):
        new_path = (
            config.HOME_DIR / self.path.name
            if not new_folder
            else config.HOME_DIR / new_folder / self.path.name
        )
        self.path.rename(new_path)

        return Note(new_path)

    def edit_frontmatter(self, metadata: dict):
        new_data = frontmatter.dumps(metadata)
        open(self.path, "w").write(new_data)

    @classmethod
    def all(cls, sort: str = "favorited", filter: str = None):
        if filter:
            x = [
                Note(i)
                for i in config.HOME_DIR.glob("**/*.txt")
                if i.parent.name == filter
            ]
        else:
            x = [Note(i) for i in config.HOME_DIR.glob("**/*.txt")]
        return sorted(
            x,
            key=attrgetter(sort),
            reverse=sort in ["favorited", "last_modified", "date_created"],
        )

    @classmethod
    def search(cls, query: str):
        return [
            SearchResult(i)
            for i in subprocess.run(
                ["grep", "-riw", query, config.HOME_DIR],
                cwd=config.HOME_DIR,
                text=True,
                capture_output=True,
            ).stdout.split("\n")
            if i
        ]

    def to_dict(self) -> dict:
        return {
            "name": self.path.stem,
            "path": str(self.path),
            "content": self.content,
            "markdown": markdown.markdown(self.content),
            "favorited": self.favorited,
            "folder": self.folder,
        }

    def __str__(self):
        return "{} {:40.40} {}".format(
            "*" if self.favorited else " ",
            self.name,
            f"({self.folder})" if self.folder else "",
        )


class Folder:
    def __init__(self, name):
        self.name = name

    @property
    def path(self):
        return config.HOME_DIR / self.name

    @classmethod
    def add(cls, name):
        name = check_duplicate(name, [i.name for i in Folder.all()])
        folder_ = Folder(name)
        folder_.path.mkdir()

        return folder_

    def delete(self):
        shutil.rmtree(self.path)

    def rename(self, new_name):
        self.path.rename(config.HOME_DIR / new_name)

    @classmethod
    def all(cls):
        return [Folder(i.name) for i in config.HOME_DIR.iterdir() if i.is_dir()]


class SearchResult:
    def __init__(self, line: str):
        self.file = Path(line.split(":")[0]).stem
        self.match = line.split(":")[1]

    def to_dict(self) -> dict:
        return {"file": self.file, "match": self.match}
