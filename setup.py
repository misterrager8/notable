import setuptools

setuptools.setup(
    name="notable",
    version="2024.03.12",
    py_modules=["backend"],
    entry_points={"console_scripts": ["notable=backend.__main__:cli"]},
    long_description=open("README.md").read(),
    license=open("LICENSE.md").read(),
)
