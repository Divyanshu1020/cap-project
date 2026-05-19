# 📚 BookNest — Online Book Store

A full-stack online bookstore capstone project built with **Angular 18**, **Flask**, and **MySQL**.

![Angular](https://img.shields.io/badge/Angular-18-DD0031?logo=angular)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)

---

## ✨ Features

### Customer Features
- 🔍 **Live Search** — RxJS debounced search (300ms) with instant results
- 📖 **Browse Books** — Paginated book listing with category filters
- 🛒 **Shopping Cart** — Add, update quantity, remove items with stock validation
- 💳 **Checkout** — Simple checkout with customer details and order confirmation
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile

### Admin Features
- 📊 **Dashboard** — Overview stats (total books, orders, revenue)
- 📝 **Manage Books** — Add, edit, delete books from the catalog
- 📦 **Manage Orders** — Update order status (Pending → Processing → Shipped → Delivered)

### Technical Features
- ⚡ **Angular Material UI** — Modern component library
- 🔄 **RESTful API** — Clean Flask REST API with 13 endpoints
- 🛡️ **Input Validation** — Server-side validation on all endpoints
- 🚦 **Rate Limiting** — Flask-Limiter for API throttling
- 🔔 **Toast Notifications** — Success/error/info feedback
- ⏳ **Loading Spinners** — Visual loading states

---

## 🏗️ Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Frontend  | Angular 18 (Standalone Components) |
| UI Library| Angular Material    |
| Backend   | Flask 3.0 + Flask-SQLAlchemy |
| Database  | MySQL 8.0           |
| ORM       | SQLAlchemy          |
| API       | RESTful JSON        |

---

## 📁 Project Structure

```
cap-project/
├── backend/                    # Flask REST API
│   ├── app/
│   │   ├── __init__.py         # App factory
│   │   ├── config.py           # Database config
│   │   ├── extensions.py       # SQLAlchemy & Limiter
│   │   ├── models/             # Database models
│   │   ├── routes/             # API endpoints
│   │   └── seed.py             # Sample data
│   ├── requirements.txt
│   └── run.py                  # Entry point
│
├── frontend/                   # Angular app
│   └── src/app/
│       ├── components/         # UI components
│       ├── services/           # API service layer
│       └── models/             # TypeScript interfaces
│
└── README.md
```

---

## 🚀 Setup & Run

### Prerequisites

- **Node.js** v18+ and **npm**
- **Python** 3.10+ and **pip**
- **MySQL Server** running on localhost

### Step 1: Create MySQL Database

```sql
CREATE DATABASE bookstore;
```

### Step 2: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run the server (auto-creates tables & seeds data)
python run.py
```

The API will start at **http://localhost:5000**

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
ng serve
```

The app will open at **http://localhost:4200**

---

## 📡 API Endpoints

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books?page=1&per_page=8&search=&category=` | List books (paginated) |
| GET | `/api/books/<id>` | Get single book |
| GET | `/api/books/categories` | Get all categories |
| POST | `/api/books` | Create book |
| PUT | `/api/books/<id>` | Update book |
| DELETE | `/api/books/<id>` | Delete book |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart items |
| POST | `/api/cart` | Add to cart |
| PUT | `/api/cart/<id>` | Update quantity |
| DELETE | `/api/cart/<id>` | Remove item |
| DELETE | `/api/cart` | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List all orders |
| POST | `/api/orders` | Place order |
| PUT | `/api/orders/<id>/status` | Update status |

---

## 🗃️ Database Schema

- **books** — id, title, author, description, price, stock, image_url, category, created_at
- **cart_items** — id, book_id (FK), quantity
- **orders** — id, total_amount, status, customer_name, customer_email, created_at
- **order_items** — id, order_id (FK), book_id (FK), quantity, price

---

## 🧪 Default Configuration

| Setting | Value |
|---------|-------|
| MySQL User | `root` |
| MySQL Password | `root` |
| MySQL Database | `bookstore` |
| Backend URL | `http://localhost:5000` |
| Frontend URL | `http://localhost:4200` |

> To change MySQL credentials, edit `backend/app/config.py` or set environment variables `DB_USER` and `DB_PASSWORD`.

---

## 📝 License

This project is for educational/capstone purposes only.
