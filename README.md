# markdownManager

**markdownManager** is a barebones Flask app to create, manage, and edit your local **Markdown** (`.md`) files in a more user-friendly way, without having to rely solely on bloated IDEs and cumbersome command-line interfaces. Metadata on these files are stored in a **YAML** format in the header of each file:

<code>
title: Markdownmanager

date_created: 2022-05-24
</code>

#### Usage

**markdownManager** can be run just like any other Flask app, with the `flask run` command. Configuration is set with an `.env` file in the same directory:

<code>
env=development

debug=1
</code>
