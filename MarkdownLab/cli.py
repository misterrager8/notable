import webview

from MarkdownLab import config, create_app

app = create_app(config)


def run():
    """Launch web interface"""
    webview.create_window("MarkdownLab", app, frameless=True, text_select=True)
    webview.start()
