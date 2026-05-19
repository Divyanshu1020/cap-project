"""Orders API routes — place order, list orders, update status."""

from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.order import Order, OrderItem
from app.models.cart import CartItem
from app.models.book import Book

orders_bp = Blueprint('orders', __name__)


@orders_bp.route('/api/orders', methods=['GET'])
def get_orders():
    """List all orders (newest first)."""
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify([order.to_dict() for order in orders])


@orders_bp.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """Get a single order by ID."""
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    return jsonify(order.to_dict())


@orders_bp.route('/api/orders', methods=['POST'])
def place_order():
    """
    Place an order from the current cart contents.

    Request body:
        customer_name (str): Customer's name
        customer_email (str): Customer's email
    """
    data = request.get_json()

    # Validate customer info
    if not data or not data.get('customer_name', '').strip():
        return jsonify({'error': "'customer_name' is required"}), 400

    if not data.get('customer_email', '').strip():
        return jsonify({'error': "'customer_email' is required"}), 400

    # Get cart items
    cart_items = CartItem.query.all()
    if not cart_items:
        return jsonify({'error': 'Cart is empty'}), 400

    # Validate stock for all items
    total_amount = 0
    order_items_data = []

    for cart_item in cart_items:
        book = Book.query.get(cart_item.book_id)
        if not book:
            return jsonify({
                'error': f'Book with ID {cart_item.book_id} not found'
            }), 404

        if cart_item.quantity > book.stock:
            return jsonify({
                'error': f'Not enough stock for "{book.title}". '
                         f'Available: {book.stock}, Requested: {cart_item.quantity}'
            }), 400

        item_total = float(book.price) * cart_item.quantity
        total_amount += item_total

        order_items_data.append({
            'book': book,
            'quantity': cart_item.quantity,
            'price': float(book.price),
        })

    # Create order
    order = Order(
        total_amount=round(total_amount, 2),
        status='Pending',
        customer_name=data['customer_name'].strip(),
        customer_email=data['customer_email'].strip(),
    )
    db.session.add(order)
    db.session.flush()  # Get order.id without committing

    # Create order items and reduce stock
    for item_data in order_items_data:
        order_item = OrderItem(
            order_id=order.id,
            book_id=item_data['book'].id,
            quantity=item_data['quantity'],
            price=item_data['price'],
        )
        db.session.add(order_item)

        # Reduce book stock
        item_data['book'].stock -= item_data['quantity']

    # Clear the cart
    CartItem.query.delete()

    db.session.commit()

    return jsonify(order.to_dict()), 201


@orders_bp.route('/api/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Update the status of an order (admin)."""
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    data = request.get_json()
    if not data or 'status' not in data:
        return jsonify({'error': "'status' is required"}), 400

    valid_statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    new_status = data['status'].strip()

    if new_status not in valid_statuses:
        return jsonify({
            'error': f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        }), 400

    order.status = new_status
    db.session.commit()

    return jsonify(order.to_dict())
