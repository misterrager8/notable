import setuptools

setuptools.setup(
    name="MarkdownLab",
    version="3.6.0",
    entry_points={"console_scripts": ["mdlab=mdlab.__main__:cli"]},
    long_description=open("README.md").read(),
    license=open("LICENSE.md").read(),
)
