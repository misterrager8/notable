import datetime
import operator
import shutil
import subprocess
from pathlib import Path

import frontmatter
import markdown

from mdlab import config


class Folder(object):
    """Folder object to contain Notes.

    Attributes:
        path (Path): full filepath of the Folder. This must be a pathlib Path, not a str
    """

    def __init__(self, path: Path):
        self.path = path

    @classmethod
    def all(cls) -> list:
        """Get all Folders in your HOME directory."""
        return [Folder(i) for i in config.HOME_DIR.iterdir() if i.is_dir()]

    @property
    def name(self) -> str:
        """str: the name of this Folder."""
        return self.path.name

    @property
    def notes(self) -> list:
        """list: Notes found in this Folder."""
        return sorted(
            [Note(i) for i in self.path.iterdir() if i.is_file() and i.suffix == ".md"],
            key=lambda y: y.favorited,
            reverse=True,
        )

    def create(self):
        """Make a new Folder."""
        self.path.mkdir()

    def rename(self, new_name: Path):
        """Rename this Folder.

        Args:
            new_name (Path): new filepath of your Folder
        """
        self.path.rename(new_name)

    def delete(self):
        """Delete this Folder."""
        shutil.rmtree(self.path)

    def to_dict(self):
        return dict(
            name=self.name, path=str(self.path), notes=[i.to_dict() for i in self.notes]
        )


class Note(object):
    """File with .md file extension.

    Attributes:
        path (Path): full filepath of the Note. This must be a pathlib Path, not a str
    """

    def __init__(self, path: Path):
        self.path = path

    @classmethod
    def all(cls) -> list:
        """Get all Notes recursively found in your HOME directory.

        Returns:
            list: all Notes
        """
        return sorted(
            [Note(i) for i in config.HOME_DIR.glob("**/*.md")],
            key=lambda z: z.favorited,
            reverse=True,
        )

    @classmethod
    def search(cls, query: str) -> list:
        """Search contents of all Notes for a match.

        Args:
            query (str): the string to search for

        Returns:
            list: Notes
        """
        return filter(lambda a: query.lower() in a.stem.lower(), Note.all())

    @classmethod
    def favorites(cls) -> list:
        """Get all Notes that are favorited.

        Returns:
            list: Notes that are favorited
        """
        return filter(lambda x: x.favorited == True, Note.all())

    @property
    def name(self) -> str:
        """str: name of this Note, containing file extension."""
        return self.path.name

    @property
    def favorited(self) -> bool:
        """bool: whether or not this Note is favorited."""
        return self.frontmatter.metadata["favorited"]

    @property
    def stem(self) -> str:
        """str: name of this Note, without file extension."""
        return self.path.stem

    @property
    def folder(self) -> Folder:
        """Folder: the folder that contains this Note."""
        return Folder(self.path.parent)

    @property
    def text(self) -> str:
        """str: the plaintext content of this Note."""
        return frontmatter.load(self.path).content

    @property
    def frontmatter(self):
        _ = frontmatter.load(self.path)
        if not frontmatter.check(self.path):
            _.metadata.update({"favorited": False})
            new_data = frontmatter.dumps(_)
            open(self.path, "w").write(new_data)

        return _

    @property
    def markdown(self) -> str:
        """str: the content of this Note, formatted for Markdown."""
        return markdown.markdown(self.text)

    @property
    def date_created(self) -> datetime.datetime:
        """datetime.datetime: the creation date of this Note."""
        return datetime.datetime.fromtimestamp(self.path.stat().st_birthtime)

    @property
    def last_modified(self) -> datetime.datetime:
        """datetime.datetime: the last time this Note was edited."""
        return datetime.datetime.fromtimestamp(self.path.stat().st_mtime)

    def create(self):
        """Create a new Note."""
        self.path.touch()

    def edit(self, content: str):
        """Edit this Note.

        Args:
            content (str): content of the edited Note
        """
        _ = self.frontmatter
        _.content = content
        new_data = frontmatter.dumps(_)
        open(self.path, "w").write(new_data)

    def toggle_favorite(self):
        """Mark this Note as favorited or not favorited."""
        _ = self.frontmatter
        _.metadata["favorited"] = not self.favorited
        new_data = frontmatter.dumps(_)
        open(self.path, "w").write(new_data)

    def rename(self, new_name: Path):
        """Rename this Note. Can also be used to move Notes between Folders.

        Args:
            new_name (Path): new desired filepath of this Note.
        """
        if self.favorited:
            self.toggle_favorite()
        self.path.rename(new_name)

    def delete(self):
        """Delete this Note."""
        if self.favorited:
            self.toggle_favorite()
        self.path.unlink()

    def to_dict(self):
        return dict(
            path=str(self.path),
            name=self.name,
            favorited=self.favorited,
            stem=self.stem,
            folder=self.folder.name,
            text=self.text,
            markdown=self.markdown,
            date_created=self.date_created.strftime("%B %-d, %Y"),
            last_modified=self.last_modified.strftime("%-m-%-d-%y @ %I:%M %p"),
        )
