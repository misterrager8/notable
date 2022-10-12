import os
from pathlib import Path

import dotenv

dotenv.load_dotenv()

ENV = os.getenv("env")
DEBUG = os.getenv("debug").lower() == "true"
BASE_DIR = Path(os.getenv("base_dir"))
FLASK_RUN_PORT = os.getenv("port")
