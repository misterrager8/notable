# Markdown Lab
---

Open-source web-app that allows you to manage markdown files and organize them, keep them in order and organized by topic, powered by Flask and Pathlib. Also inspired by [archivy](https://github.com/archivy/archivy).

## Features

- Save the html content of webpages you want to read later and save them into .md files, all you need is the URL to enter into the form.

- Your favorites are saved in a favorites.txt file for quicker access. You can also make quick notes without having to decide on a title and the folder you want it in.

- Selectable themes: light, dark, sepia, sepia dark, charcoal

## Usage

But first, you need to set some config options...

### Configuration

`base_dir` - fullpath home of directory, where you want all your files to be

`env` [optional]

`debug` [optional]

`port` [optional]

### Command-Line

Clone this repo, this run the command `python3 setup.py develop`. Then all you need to do is run the command `mdlab` and Flask will start running the app at the IP address shown on the terminal. Go to your preferred browser and navigate to the address, and there's your interface!
