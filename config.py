import dotenv
import os

dotenv.load_dotenv()

DEBUG = os.getenv("DEBUG")
ENV = os.getenv("ENV")
MAIN_FOLDER = os.getenv("MAIN_FOLDER")
