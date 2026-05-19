"""Books API routes — full CRUD with search and pagination."""

from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.book import Book

books_bp = Blueprint('books', __name__)


@books_bp.route('/api/books', methods=['GET'])
def get_books():
    """
    List books with pagination, search, and category filter.

    Query params:
        page (int): Page number, default 1
        per_page (int): Items per page, default 8
        search (str): Search in title and author
        category (str): Filter by category
    """
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 8, type=int)
    search = request.args.get('search', '', type=str).strip()
    category = request.args.get('category', '', type=str).strip()

    query = Book.query

    # Search filter
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            db.or_(
                Book.title.ilike(search_pattern),
                Book.author.ilike(search_pattern),
            )
        )

    # Category filter
    if category:
        query = query.filter(Book.category == category)

    # Order by newest first
    query = query.order_by(Book.created_at.desc())

    # Paginate
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'books': [book.to_dict() for book in pagination.items],
        'total': pagination.total,
        'page': pagination.page,
        'per_page': pagination.per_page,
        'pages': pagination.pages,
    })


@books_bp.route('/api/books/categories', methods=['GET'])
def get_categories():
    """Get list of all unique book categories."""
    categories = db.session.query(Book.category).distinct().filter(
        Book.category.isnot(None)
    ).all()
    return jsonify([c[0] for c in categories if c[0]])


@books_bp.route('/api/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    """Get a single book by ID."""
    book = Book.query.get(book_id)
    if not book:
        return jsonify({'error': 'Book not found'}), 404
    return jsonify(book.to_dict())


@books_bp.route('/api/books', methods=['POST'])
def create_book():
    """Create a new book (admin)."""
    data = request.get_json()

    # Validation
    required_fields = ['title', 'author', 'price']
    for field in required_fields:
        if not data or field not in data or not str(data[field]).strip():
            return jsonify({'error': f"'{field}' is required"}), 400

    try:
        price = float(data['price'])
        if price < 0:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({'error': 'Price must be a positive number'}), 400

    stock = data.get('stock', 0)
    try:
        stock = int(stock)
        if stock < 0:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({'error': 'Stock must be a non-negative integer'}), 400

    book = Book(
        title=data['title'].strip(),
        author=data['author'].strip(),
        description=data.get('description', '').strip(),
        price=price,
        stock=stock,
        image_url=data.get('image_url', '').strip(),
        category=data.get('category', '').strip() or None,
    )

    db.session.add(book)
    db.session.commit()

    return jsonify(book.to_dict()), 201


@books_bp.route('/api/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    """Update an existing book (admin)."""
    book = Book.query.get(book_id)
    if not book:
        return jsonify({'error': 'Book not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    # Update fields if provided
    if 'title' in data:
        if not str(data['title']).strip():
            return jsonify({'error': 'Title cannot be empty'}), 400
        book.title = data['title'].strip()

    if 'author' in data:
        if not str(data['author']).strip():
            return jsonify({'error': 'Author cannot be empty'}), 400
        book.author = data['author'].strip()

    if 'description' in data:
        book.description = data['description'].strip()

    if 'price' in data:
        try:
            price = float(data['price'])
            if price < 0:
                raise ValueError
            book.price = price
        except (ValueError, TypeError):
            return jsonify({'error': 'Price must be a positive number'}), 400

    if 'stock' in data:
        try:
            stock = int(data['stock'])
            if stock < 0:
                raise ValueError
            book.stock = stock
        except (ValueError, TypeError):
            return jsonify({'error': 'Stock must be a non-negative integer'}), 400

    if 'image_url' in data:
        book.image_url = data['image_url'].strip()

    if 'category' in data:
        book.category = data['category'].strip() or None

    db.session.commit()
    return jsonify(book.to_dict())


@books_bp.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    """Delete a book (admin)."""
    book = Book.query.get(book_id)
    if not book:
        return jsonify({'error': 'Book not found'}), 404

    db.session.delete(book)
    db.session.commit()

    return jsonify({'message': 'Book deleted successfully'})
