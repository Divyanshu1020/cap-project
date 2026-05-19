"""Book model."""

from datetime import datetime
from app.extensions import db


class Book(db.Model):
    """Represents a book in the store."""

    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, nullable=False, default=0)
    image_url = db.Column(db.String(500), nullable=True)
    category = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Serialize book to dictionary."""
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'description': self.description,
            'price': float(self.price),
            'stock': self.stock,
            'image_url': self.image_url,
            'category': self.category,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
