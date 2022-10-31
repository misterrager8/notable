# Markdown Lab
---

Minimalist markdown text editor, running in any web browser of your choice. Powered by Flask and JS. Also inspired by [archivy](https://github.com/archivy/archivy).

![screen1](docs/screencapture1.png)

## Features
- Organize your folders and markdown notes in any directory you choose
- Save your favorite notes for quicker access
- One-page interface for simplicity, with light/dark themes

## Installation / Usage
1. Clone this repo
2. Run `python3 setup.py develop` command in working directory
3. Set config variables in `.env`:

        home_dir (directory of your choice)
        debug=['true','false']
        env=['production', 'development']

4. Run `mdlab` command
