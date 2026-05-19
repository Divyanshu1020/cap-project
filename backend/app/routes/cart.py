"""Cart API routes — add, update, remove, clear."""

from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.cart import CartItem
from app.models.book import Book

cart_bp = Blueprint('cart', __name__)


@cart_bp.route('/api/cart', methods=['GET'])
def get_cart():
    """Get all items in the cart with book details and totals."""
    items = CartItem.query.all()
    cart_items = [item.to_dict() for item in items]

    # Calculate totals
    total_items = sum(item.quantity for item in items)
    total_price = sum(
        float(item.book.price) * item.quantity
        for item in items if item.book
    )

    return jsonify({
        'items': cart_items,
        'total_items': total_items,
        'total_price': round(total_price, 2),
    })


@cart_bp.route('/api/cart', methods=['POST'])
def add_to_cart():
    """Add a book to the cart (or increase quantity if already in cart)."""
    data = request.get_json()

    if not data or 'book_id' not in data:
        return jsonify({'error': "'book_id' is required"}), 400

    book_id = data['book_id']
    quantity = data.get('quantity', 1)

    try:
        quantity = int(quantity)
        if quantity < 1:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({'error': 'Quantity must be a positive integer'}), 400

    # Check if book exists
    book = Book.query.get(book_id)
    if not book:
        return jsonify({'error': 'Book not found'}), 404

    # Check stock
    existing_item = CartItem.query.filter_by(book_id=book_id).first()
    current_qty = existing_item.quantity if existing_item else 0
    needed_qty = current_qty + quantity

    if needed_qty > book.stock:
        return jsonify({
            'error': f'Not enough stock. Available: {book.stock}, '
                     f'In cart: {current_qty}, Requested: {quantity}'
        }), 400

    if existing_item:
        existing_item.quantity = needed_qty
    else:
        existing_item = CartItem(book_id=book_id, quantity=quantity)
        db.session.add(existing_item)

    db.session.commit()

    return jsonify(existing_item.to_dict()), 201


@cart_bp.route('/api/cart/<int:item_id>', methods=['PUT'])
def update_cart_item(item_id):
    """Update the quantity of a cart item."""
    item = CartItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Cart item not found'}), 404

    data = request.get_json()
    if not data or 'quantity' not in data:
        return jsonify({'error': "'quantity' is required"}), 400

    try:
        quantity = int(data['quantity'])
        if quantity < 1:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({'error': 'Quantity must be a positive integer'}), 400

    # Stock validation
    book = Book.query.get(item.book_id)
    if quantity > book.stock:
        return jsonify({
            'error': f'Not enough stock. Available: {book.stock}'
        }), 400

    item.quantity = quantity
    db.session.commit()

    return jsonify(item.to_dict())


@cart_bp.route('/api/cart/<int:item_id>', methods=['DELETE'])
def remove_cart_item(item_id):
    """Remove a single item from the cart."""
    item = CartItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Cart item not found'}), 404

    db.session.delete(item)
    db.session.commit()

    return jsonify({'message': 'Item removed from cart'})


@cart_bp.route('/api/cart', methods=['DELETE'])
def clear_cart():
    """Clear all items from the cart."""
    CartItem.query.delete()
    db.session.commit()

    return jsonify({'message': 'Cart cleared'})
