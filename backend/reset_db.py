from app.extensions import db
from app import create_app

app = create_app()
with app.app_context():
    print("Dropping all tables...")
    db.drop_all()
    print("Creating all tables...")
    db.create_all()
    print("Seeding database...")
    from app.seed import seed_database
    seed_database()
    print("Database reset complete.")
