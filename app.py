import config
from MarkdownLab import create_app
import webview

app = create_app(config)

if __name__ == "__main__":
    webview.create_window("Markdown Lab", app, frameless=True, text_select=True)
    webview.start(debug=True)
