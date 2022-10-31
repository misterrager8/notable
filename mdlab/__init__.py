from flask import Flask


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    with app.app_context():
        from mdlab.views.folders import folders
        from mdlab.views.notes import notes

        app.register_blueprint(folders)
        app.register_blueprint(notes)

        return app
