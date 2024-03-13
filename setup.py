import setuptools

setuptools.setup(
    name="notable",
    version="2024.03.12",
    entry_points={"console_scripts": ["notable=notable.__main__:cli"]},
    long_description=open("README.md").read(),
    license=open("LICENSE.md").read(),
)
