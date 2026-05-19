"""Application configuration."""

import os


class Config:
    """Base configuration class."""

    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'bookstore-secret-key-dev')

    # MySQL Database
    DB_USER = os.environ.get('DB_USER', 'root')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', 'root')
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_PORT = os.environ.get('DB_PORT', '3306')
    DB_NAME = os.environ.get('DB_NAME', 'bookstore')

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Flask-Limiter
    RATELIMIT_DEFAULT = "60/minute"
    RATELIMIT_STORAGE_URI = "memory://"
