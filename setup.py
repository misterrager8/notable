import setuptools

setuptools.setup(
    name="MarkdownLab",
    entry_points={"console_scripts": ["markdownlab=MarkdownLab.cli:cli"]},
)
