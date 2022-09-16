import html2text
import requests
from bs4 import BeautifulSoup


class Link:
    def __init__(self, url: str, title: str, source_name: str):
        self.url = url
        self.title = title
        self.source_name = source_name


def get_soup(url: str):
    return BeautifulSoup(requests.get(url).text, "html.parser")


def get_title(url: str):
    return get_soup(url).find("title").get_text()


def get_html2text(url: str):
    return html2text.html2text(str(get_soup(url)))
