import datetime
import shutil

import frontmatter
import markdown

from . import config


class Folder:
    def __init__(self, name: str):
        self.name = name

    @property
    def path(self):
        return config.HOME_DIR / self.name

    @property
    def notes(self):
        return sorted(
            [
                Note(self.name, i.name)
                for i in self.path.iterdir()
                if i.suffix in [".md", ".txt"]
            ],
            key=lambda x: (x.favorited, x.path.suffix),
            reverse=True,
        )

    @classmethod
    def create(cls, name: str):
        _ = Folder(name)
        _.path.mkdir()
        return _

    def rename(self, new_name: str):
        self.path.rename(config.HOME_DIR / new_name)
        return Folder(new_name)

    def delete(self):
        shutil.rmtree(self.path)

    @classmethod
    def all(cls):
        return [Folder(i.name) for i in config.HOME_DIR.iterdir() if i.is_dir()]

    def to_dict(self):
        return dict(
            name=self.name, path=str(self.path), notes=[i.to_dict() for i in self.notes]
        )


class Note:
    def __init__(self, folder: str, name: str):
        self.folder = folder
        self.name = name

    @property
    def path(self):
        return config.HOME_DIR / self.folder / self.name

    @property
    def stem(self):
        return self.path.stem

    @property
    def favorited(self):
        return self.frontmatter.metadata["favorited"]

    @property
    def frontmatter(self):
        _ = frontmatter.load(self.path)
        if not frontmatter.check(self.path):
            _.metadata.update({"favorited": False})
            self.edit_frontmatter(_)

        return _

    @property
    def content(self):
        _ = self.frontmatter.content
        return dict(txt=_, md=markdown.markdown(_))

    @property
    def date_created(self) -> datetime.datetime:
        return datetime.datetime.fromtimestamp(self.path.stat().st_birthtime)

    @property
    def last_modified(self) -> datetime.datetime:
        return datetime.datetime.fromtimestamp(self.path.stat().st_mtime)

    @classmethod
    def create(cls, folder: str, name: str):
        _ = Note(folder, name)
        _.path.touch()
        return _

    def edit(self, content: str):
        _ = self.frontmatter
        _.content = content
        self.edit_frontmatter(_)

    def rename(self, new_name: str):
        self.path.rename(config.HOME_DIR / self.folder / f"{new_name}")
        return Note(self.folder, f"{new_name}")

    def toggle_favorite(self):
        _ = self.frontmatter
        _.metadata.update({"favorited": not _.get("favorited")})
        self.edit_frontmatter(_)

    def edit_frontmatter(self, metadata: dict):
        new_data = frontmatter.dumps(metadata)
        open(self.path, "w").write(new_data)

    def delete(self):
        self.path.unlink()

    @classmethod
    def all(cls):
        return [Note(i.parent.name, i.name) for i in config.HOME_DIR.glob("**/*.md")]

    @classmethod
    def favorites(cls):
        return [i for i in Note.all() if i.favorited]

    def to_dict(self):
        return dict(
            name=self.name,
            path=str(self.path),
            stem=self.stem,
            suffix=self.path.suffix,
            folder=self.folder,
            content=self.content,
            favorited=self.favorited,
            date_created=self.date_created.strftime("%B %-d, %Y"),
            last_modified=self.last_modified.strftime("%B %-d, %Y @ %I:%M %p"),
        )