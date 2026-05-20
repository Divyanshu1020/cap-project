"""Auth API routes — signup, login, get current user."""

from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    """Register a new user account."""
    data = request.get_json()

    if not data or not data.get('name', '').strip():
        return jsonify({'error': "'name' is required"}), 400

    if not data.get('email', '').strip():
        return jsonify({'error': "'email' is required"}), 400

    if not data.get('password', '').strip():
        return jsonify({'error': "'password' is required"}), 400

    # Check if email already exists
    existing = User.query.filter_by(email=data['email'].strip().lower()).first()
    if existing:
        return jsonify({'error': 'Email already registered'}), 409

    user = User(
        name=data['name'].strip(),
        email=data['email'].strip().lower(),
        password=data['password'],  # Plain text — capstone only
        role='user',
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Account created successfully', 'user': user.to_dict()}), 201


@auth_bp.route('/api/login', methods=['POST'])
def login():
    """Log in with email and password."""
    data = request.get_json()

    if not data or not data.get('email', '').strip():
        return jsonify({'error': "'email' is required"}), 400

    if not data.get('password', '').strip():
        return jsonify({'error': "'password' is required"}), 400

    user = User.query.filter_by(email=data['email'].strip().lower()).first()

    if not user or user.password != data['password']:
        return jsonify({'error': 'Invalid email or password'}), 401

    return jsonify({'message': 'Login successful', 'user': user.to_dict()})


@auth_bp.route('/api/me/<int:user_id>', methods=['GET'])
def get_me(user_id):
    """Get current user info by ID (simple session check)."""
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.to_dict())
