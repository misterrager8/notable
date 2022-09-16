from markdown_lab import config, create_app

app = create_app(config)


def run():
    """Launch web interface"""
    app.run(port=config.FLASK_RUN_PORT)
