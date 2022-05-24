import click
import os
import datetime


@click.group()
def cli():
    pass


@cli.command()
def add_note():
    new_note = input("name: ")
    with open("notes/Unsorted/%s.md" % new_note.title(), "x") as f:
        f.write("title: %s\n" % new_note.title())
        f.write("date_created: %s\n\n" % datetime.datetime.now().strftime("%F"))
    click.secho("added.", fg="green")


@cli.command()
def list_notes():
    for root, dirs, files in os.walk("notes/"):
        for j in dirs:
            for i in os.listdir("notes/" + j):
                if ".md" in i:
                    click.secho("[%s] %s" % (j, i.strip(".md")), fg="green")


@cli.command()
def edit_note():
    click.secho("edited.", fg="green")


@cli.command()
@click.argument("filename")
def delete_note(filename: str):
    os.remove(filename)
    click.secho("deleted.", fg="green")


@cli.command()
def add_folder():
    new_folder = input("name: ")
    os.mkdir("notes/%s" % new_folder.title())
    click.secho("added.", fg="green")


@cli.command()
def list_folders():
    for root, dirs, files in os.walk("notes/"):
        for i in dirs:
            click.secho(i, fg="green")


@cli.command()
def edit_folder():
    click.secho("edited.", fg="green")


@cli.command()
@click.argument("filename")
def delete_folder(filename: str):
    os.remove(filename)
    click.secho("deleted.", fg="green")


if __name__ == "__main__":
    cli()
