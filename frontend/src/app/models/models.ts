/**
 * Data models used throughout the application.
 */

/** Book model matching the backend API response */
export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category: string;
  created_at: string;
}

/** Paginated response from GET /api/books */
export interface BookListResponse {
  books: Book[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

/** Cart item from the API (includes nested book) */
export interface CartItem {
  id: number;
  book_id: number;
  quantity: number;
  book: Book;
}

/** Cart response from GET /api/cart */
export interface CartResponse {
  items: CartItem[];
  total_items: number;
  total_price: number;
}

/** Order item within an order */
export interface OrderItem {
  id: number;
  order_id: number;
  book_id: number;
  quantity: number;
  price: number;
  book_title: string;
}

/** Order from the API */
export interface Order {
  id: number;
  total_amount: number;
  status: string;
  customer_name: string;
  customer_email: string;
  created_at: string;
  items: OrderItem[];
}

/** User from the API */
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}
