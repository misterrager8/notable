import setuptools

setuptools.setup(
    name="MarkdownLab",
    long_description=open("README.md").read(),
    license=open("LICENSE.md").read(),
    entry_points={"console_scripts": ["mdlab=MarkdownLab.cli:run"]},
)
