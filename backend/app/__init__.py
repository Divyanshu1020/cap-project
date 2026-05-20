"""Flask application factory."""

from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.extensions import db, limiter


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    limiter.init_app(app)

    # Enable CORS for Angular dev server
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints (routes)
    from app.routes.books import books_bp
    from app.routes.cart import cart_bp
    from app.routes.orders import orders_bp
    from app.routes.auth import auth_bp

    app.register_blueprint(books_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(auth_bp)

    # Create database tables and seed data
    with app.app_context():
        from app.models import Book, CartItem, Order, OrderItem, User  # noqa: F401
        db.create_all()

        from app.seed import seed_database
        seed_database()

    return app

