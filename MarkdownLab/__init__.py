from flask import Flask


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    with app.app_context():
        from MarkdownLab.views.files import files
        from MarkdownLab.views.folders import folders

        app.register_blueprint(files)
        app.register_blueprint(folders)

        return app
