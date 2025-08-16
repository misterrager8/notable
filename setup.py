import setuptools

setuptools.setup(
    name="notable",
    version="2025.08.15",
    py_modules=["notable"],
    entry_points={"console_scripts": ["notable=notable.__main__:cli"]},
    long_description=open("README.md").read(),
    license=open("LICENSE.md").read(),
)
