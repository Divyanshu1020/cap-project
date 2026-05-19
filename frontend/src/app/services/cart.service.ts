import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CartItem, CartResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart';

  /** Observable cart count for the navbar badge */
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshCartCount();
  }

  /** Get all cart items with totals */
  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.apiUrl).pipe(
      tap(res => this.cartCountSubject.next(res.total_items))
    );
  }

  /** Add a book to cart */
  addToCart(bookId: number, quantity = 1): Observable<CartItem> {
    return this.http.post<CartItem>(this.apiUrl, { book_id: bookId, quantity }).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  /** Update cart item quantity */
  updateCartItem(itemId: number, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/${itemId}`, { quantity }).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  /** Remove item from cart */
  removeCartItem(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${itemId}`).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  /** Clear all items in cart */
  clearCart(): Observable<any> {
    return this.http.delete(this.apiUrl).pipe(
      tap(() => this.cartCountSubject.next(0))
    );
  }

  /** Refresh the cart count from the server */
  private refreshCartCount(): void {
    this.http.get<CartResponse>(this.apiUrl).subscribe({
      next: res => this.cartCountSubject.next(res.total_items),
      error: () => this.cartCountSubject.next(0),
    });
  }
}
