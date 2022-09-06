import dotenv
import os

dotenv.load_dotenv()

ENV = os.getenv("env")
DEBUG = os.getenv("debug")
BASE_DIR = os.getenv("base_dir")
PORT = os.getenv("port")
