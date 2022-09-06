import os

import dotenv

dotenv.load_dotenv()

ENV = os.getenv("env")
DEBUG = os.getenv("debug")
BASE_DIR = os.getenv("base_dir")
FLASK_RUN_PORT = os.getenv("port")
