from flask_cors import CORS
from backend import config, create_app

if __name__ == "__main__":
    app = create_app(config)
    CORS(app)
    app.run(debug=True, port=config.PORT)
