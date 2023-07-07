import datetime
from operator import attrgetter
from pathlib import Path
import subprocess

import frontmatter
import markdown

from mdlab import config


class Note:
    def __init__(self, name: str):
        self.name = name

    @property
    def path(self):
        return config.HOME_DIR / f"{self.name}.md"

    @property
    def frontmatter(self):
        _ = frontmatter.load(self.path)
        if not frontmatter.check(self.path):
            _.metadata.update({"favorited": False})

        return _

    @property
    def content(self):
        _ = self.frontmatter.content
        return {"txt": _, "md": markdown.markdown(_)}

    @property
    def favorited(self):
        return self.frontmatter.get("favorited")

    @property
    def tag(self):
        return self.frontmatter.get("tag")

    @property
    def date_created(self) -> datetime.datetime:
        return datetime.datetime.fromtimestamp(self.path.stat().st_birthtime)

    @property
    def last_modified(self) -> datetime.datetime:
        return datetime.datetime.fromtimestamp(self.path.stat().st_mtime)

    @classmethod
    def add(cls, name: str):
        _ = Note(name)
        _.path.touch()

        return _

    def delete(self):
        self.path.unlink()

    def toggle_favorite(self):
        _ = self.frontmatter
        _.metadata.update({"favorited": not _.metadata.get("favorited")})
        self.edit_frontmatter(_)

    def edit(self, content: str):
        _ = self.frontmatter
        _.content = content
        self.edit_frontmatter(_)

    def rename(self, new_name: str):
        new_path = config.HOME_DIR / f"{new_name}.md"
        self.path.rename(new_path)

        return Note(new_name)

    def edit_tag(self, new_tag: str):
        _ = self.frontmatter
        _.metadata.update({"tag": new_tag})
        self.edit_frontmatter(_)

    def edit_frontmatter(self, metadata: dict):
        new_data = frontmatter.dumps(metadata)
        open(self.path, "w").write(new_data)

    @classmethod
    def all(cls, sort: str = "favorited", filter: str = None):
        return sorted(
            [Note(i.stem) for i in config.HOME_DIR.glob("**/*.md")],
            key=attrgetter(sort),
            reverse=sort == "favorited",
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
            "name": self.name,
            "path": str(self.path),
            "content": self.content,
            "favorited": self.favorited,
            "tag": self.tag,
        }


class SearchResult:
    def __init__(self, line: str):
        self.file = Path(line.split(":")[0]).stem
        self.match = line.split(":")[1]

    def to_dict(self) -> dict:
        return {"file": self.file, "match": self.match}
