"""Cart item model."""

from app.extensions import db


class CartItem(db.Model):
    """Represents an item in the shopping cart."""

    __tablename__ = 'cart_items'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    # Relationship to Book
    book = db.relationship('Book', backref='cart_items', lazy=True)

    def to_dict(self):
        """Serialize cart item to dictionary (includes book details)."""
        return {
            'id': self.id,
            'book_id': self.book_id,
            'quantity': self.quantity,
            'book': self.book.to_dict() if self.book else None,
        }
