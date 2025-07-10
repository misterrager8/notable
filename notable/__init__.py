from flask import Flask

app = Flask(__name__, static_url_path="", static_folder="../frontend/build")


def create_app(config):
    app.config.from_object(config)

    with app.app_context():
        from . import routes

        return app
