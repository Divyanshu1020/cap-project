"""Flask extensions initialized here to avoid circular imports."""

from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Database ORM
db = SQLAlchemy()

# Rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["60 per minute"],
    storage_uri="memory://",
)
