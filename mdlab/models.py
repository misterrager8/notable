import datetime
import operator
import shutil
import subprocess
from pathlib import Path

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
    def notes(self, sort: str = "last_modified", reverse: bool = True) -> list:
        """list: Notes found in this Folder."""
        return sorted(
            [Note(i) for i in self.path.iterdir() if i.is_file() and i.suffix == ".md"],
            key=operator.attrgetter(sort),
            reverse=reverse,
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
    def all(cls, sort: str = "last_modified", reverse: bool = True) -> list:
        """Get all Notes recursively found in your HOME directory.

        Args:
            sort (str): attributed to sort Notes by. 'last_modified' by default.
            reverse (bool): sort in descending order. True by default.

        Returns:
            list: all Notes
        """
        return sorted(
            [Note(i) for i in config.HOME_DIR.glob("**/*.md")],
            key=operator.attrgetter(sort),
            reverse=reverse,
        )

    @classmethod
    def search(cls, query: str) -> list:
        """Search contents of all Notes for a match.

        Args:
            query (str): the string to search for

        Returns:
            list: SearchResult objects
        """
        return [
            SearchResult(Path(i.split(":")[0]), "".join(i.split(":")[1:]))
            for i in subprocess.run(
                ["grep", "-r", query, config.HOME_DIR],
                cwd=config.HOME_DIR,
                capture_output=True,
                text=True,
            ).stdout.split("\n")
            if i
        ]

    @classmethod
    def favorites(cls) -> list:
        """Get all Note paths found in the favorites.txt file.

        Returns:
            list: Notes that are favorited
        """
        return [
            Note(Path(i.strip()))
            for i in open(config.HOME_DIR / "favorites.txt").readlines()
            if i.strip()
        ]

    @property
    def name(self) -> str:
        """str: name of this Note, containing file extension."""
        return self.path.name

    @property
    def favorited(self) -> bool:
        """bool: whether or not this Note is favorited."""
        return str(self.path) in open(config.HOME_DIR / "favorites.txt").read()

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
        return open(self.path).read()

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
        open(self.path, "w").write(content)

    def toggle_favorite(self):
        """Mark this Note as favorited or not favorited."""
        favs = open(config.HOME_DIR / "favorites.txt").read()
        if self.favorited:
            open((config.HOME_DIR / "favorites.txt"), "w").write(
                favs.replace(f"{self.path}\n", "")
            )
        else:
            open((config.HOME_DIR / "favorites.txt"), "a").write(f"{self.path}\n")

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
            date_created=self.date_created.strftime("%-m-%-d-%Y @ %I:%M %p"),
            last_modified=self.last_modified.strftime("%-m/%-d/%y"),
        )


class Memo(object):
    """File with .txt file extension.

    Attributes:
        path (Path): full filepath of the Memo. This must be a pathlib Path, not a str
    """

    def __init__(self, path: Path):
        self.path = path

    @classmethod
    def all(cls, sort: str = "last_modified", reverse: bool = True) -> list:
        """Get all Memos recursively found in your HOME directory.

        Args:
            sort (str): attributed to sort Memos by. 'last_modified' by default.
            reverse (bool): sort in descending order. True by default.

        Returns:
            list: all Memos
        """
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
        """str: name of this Memo, containing file extension."""
        return self.path.name

    @property
    def stem(self) -> str:
        """str: name of this Memo, without file extension."""
        return self.path.stem

    @property
    def folder(self) -> Folder:
        """Folder: the folder that contains this Memo."""
        return Folder(self.path.parent)

    @property
    def text(self) -> str:
        """str: the plaintext content of this Memo."""
        return open(self.path).read()

    @property
    def date_created(self) -> datetime.datetime:
        """datetime.datetime: the creation date of this Memo."""
        return datetime.datetime.fromtimestamp(self.path.stat().st_birthtime)

    @property
    def last_modified(self) -> datetime.datetime:
        """datetime.datetime: the last time this Memo was edited."""
        return datetime.datetime.fromtimestamp(self.path.stat().st_mtime)

    def create(self):
        """Create a new Memo."""
        self.path.touch()

    def edit(self, content: str):
        """Edit this Memo.

        Args:
            content (str): content of the edited Memo
        """
        open(self.path, "w").write(content)

    def rename(self, new_name: Path):
        """Rename this Memo. Can also be used to move Notes between Folders.

        Args:
            new_name (Path): new desired filepath of this Memo.
        """
        self.path.rename(new_name)

    def publish(self):
        """Convert this Memo to a Note.

        Returns:
            Note: the new Note created with this Memo
        """
        _ = Note(config.HOME_DIR / self.folder.name / f"{self.stem}.md")
        _.create()
        _.edit(self.text)
        return _

    def delete(self):
        """Delete this Memo."""
        self.path.unlink()


class SearchResult(object):
    """Object used for Note search functionality.

    Attributes:
        path (Path): full filepath of the Folder. This must be a pathlib Path, not a str
        match (str): segment of the Note where the search query can be found
    """

    def __init__(self, path: Path, match: str):
        self.path = path
        self.match = match
