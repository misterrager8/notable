import os
from pathlib import Path

import dotenv

dotenv.load_dotenv()

HOME_DIR = Path(os.getenv("home_dir"))
PORT = os.getenv("port")

config_dict = dotenv.dotenv_values()
