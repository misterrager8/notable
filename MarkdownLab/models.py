import pathlib

from MarkdownLab import config


class Folder:
    def __init__(self, path: pathlib.Path):
        self.path = path

    def get_files(self):
        return sorted(
            [i for i in self.path.iterdir() if i.is_file() and ".md" in i.name],
            key=lambda x: x.stat().st_mtime,
            reverse=True,
        )


class File:
    def __init__(self, path: pathlib.Path):
        self.path = path

    def favorited(self):
        return (
            str(self.path)
            in open(pathlib.Path(config.BASE_DIR) / "favorites.txt").read()
        )
