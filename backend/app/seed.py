"""Seed script to populate the database with sample books."""

from app.extensions import db
from app.models.book import Book


SAMPLE_BOOKS = [
    {
        'title': 'The Great Gatsby',
        'author': 'F. Scott Fitzgerald',
        'description': 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, set in the Jazz Age on Long Island.',
        'price': 12.99,
        'stock': 25,
        'image_url': 'https://picsum.photos/seed/gatsby/300/450',
        'category': 'Fiction',
    },
    {
        'title': 'To Kill a Mockingbird',
        'author': 'Harper Lee',
        'description': 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
        'price': 14.99,
        'stock': 30,
        'image_url': 'https://picsum.photos/seed/mockingbird/300/450',
        'category': 'Fiction',
    },
    {
        'title': '1984',
        'author': 'George Orwell',
        'description': 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.',
        'price': 11.99,
        'stock': 20,
        'image_url': 'https://picsum.photos/seed/nineteen84/300/450',
        'category': 'Science Fiction',
    },
    {
        'title': 'Pride and Prejudice',
        'author': 'Jane Austen',
        'description': 'A romantic novel of manners following the character development of Elizabeth Bennet.',
        'price': 9.99,
        'stock': 15,
        'image_url': 'https://picsum.photos/seed/pride/300/450',
        'category': 'Romance',
    },
    {
        'title': 'The Catcher in the Rye',
        'author': 'J.D. Salinger',
        'description': 'The story of Holden Caulfield, a teenager navigating the complexities of adolescence in 1950s New York.',
        'price': 10.99,
        'stock': 18,
        'image_url': 'https://picsum.photos/seed/catcher/300/450',
        'category': 'Fiction',
    },
    {
        'title': 'Sapiens: A Brief History of Humankind',
        'author': 'Yuval Noah Harari',
        'description': 'A groundbreaking narrative of humanity\'s creation and evolution that explores how biology and history have defined us.',
        'price': 18.99,
        'stock': 22,
        'image_url': 'https://picsum.photos/seed/sapiens/300/450',
        'category': 'Non-Fiction',
    },
    {
        'title': 'Dune',
        'author': 'Frank Herbert',
        'description': 'Set in the distant future, this epic science fiction novel tells the story of Paul Atreides on the desert planet Arrakis.',
        'price': 15.99,
        'stock': 12,
        'image_url': 'https://picsum.photos/seed/dune/300/450',
        'category': 'Science Fiction',
    },
    {
        'title': 'The Hobbit',
        'author': 'J.R.R. Tolkien',
        'description': 'A fantasy novel about the adventures of Bilbo Baggins, who is swept into an epic quest to reclaim the lost Dwarf Kingdom.',
        'price': 13.99,
        'stock': 28,
        'image_url': 'https://picsum.photos/seed/hobbit/300/450',
        'category': 'Fantasy',
    },
    {
        'title': 'Atomic Habits',
        'author': 'James Clear',
        'description': 'A practical guide to breaking bad habits and building good ones through tiny changes that deliver remarkable results.',
        'price': 16.99,
        'stock': 35,
        'image_url': 'https://picsum.photos/seed/atomic/300/450',
        'category': 'Self-Help',
    },
    {
        'title': 'The Alchemist',
        'author': 'Paulo Coelho',
        'description': 'A mystical story about Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.',
        'price': 11.49,
        'stock': 40,
        'image_url': 'https://picsum.photos/seed/alchemist/300/450',
        'category': 'Fiction',
    },
    {
        'title': 'Clean Code',
        'author': 'Robert C. Martin',
        'description': 'A handbook of agile software craftsmanship that teaches the principles of writing clean, readable code.',
        'price': 34.99,
        'stock': 10,
        'image_url': 'https://picsum.photos/seed/cleancode/300/450',
        'category': 'Technology',
    },
    {
        'title': 'Educated',
        'author': 'Tara Westover',
        'description': 'A memoir about a young girl who leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
        'price': 14.49,
        'stock': 19,
        'image_url': 'https://picsum.photos/seed/educated/300/450',
        'category': 'Non-Fiction',
    },
    {
        'title': 'The Lord of the Rings',
        'author': 'J.R.R. Tolkien',
        'description': 'An epic high-fantasy novel following hobbits, elves, and men as they battle against the Dark Lord Sauron.',
        'price': 22.99,
        'stock': 15,
        'image_url': 'https://picsum.photos/seed/lotr/300/450',
        'category': 'Fantasy',
    },
    {
        'title': 'Thinking, Fast and Slow',
        'author': 'Daniel Kahneman',
        'description': 'An exploration of the two systems that drive the way we think — fast, intuitive thinking and slow, deliberate thinking.',
        'price': 17.99,
        'stock': 14,
        'image_url': 'https://picsum.photos/seed/thinking/300/450',
        'category': 'Non-Fiction',
    },
    {
        'title': 'Harry Potter and the Sorcerer\'s Stone',
        'author': 'J.K. Rowling',
        'description': 'The first book in the Harry Potter series, following a young wizard\'s journey at Hogwarts School of Witchcraft.',
        'price': 12.49,
        'stock': 50,
        'image_url': 'https://picsum.photos/seed/harrypotter/300/450',
        'category': 'Fantasy',
    },
    {
        'title': 'The Lean Startup',
        'author': 'Eric Ries',
        'description': 'A new approach to business that teaches entrepreneurs how to operate more efficiently through validated learning.',
        'price': 19.99,
        'stock': 8,
        'image_url': 'https://picsum.photos/seed/leanstartup/300/450',
        'category': 'Business',
    },
]


def seed_database():
    """Insert sample books into the database if table is empty."""
    if Book.query.count() == 0:
        for book_data in SAMPLE_BOOKS:
            book = Book(**book_data)
            db.session.add(book)
        db.session.commit()
        print(f"SUCCESS: Seeded {len(SAMPLE_BOOKS)} books into the database.")
    else:
        print(f"INFO: Database already has {Book.query.count()} books. Skipping seed.")
