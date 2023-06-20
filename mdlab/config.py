import os
from pathlib import Path

import dotenv

dotenv.load_dotenv()

HOME_DIR = Path.cwd() / "Notes"
try:
    HOME_DIR = Path(os.getenv("home_dir"))
except:
    # HOME_DIR.mkdir()
    print("No path set. Current dir will be used instead")
