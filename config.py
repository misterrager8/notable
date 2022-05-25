import os
import dotenv

dotenv.load_dotenv()

DEBUG = os.getenv("debug")
ENV = os.getenv("env")
