from flask import Flask


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    with app.app_context():
        from markdown_lab.views.files import files
        from markdown_lab.views.folders import folders

        app.register_blueprint(files)
        app.register_blueprint(folders)

        return app
