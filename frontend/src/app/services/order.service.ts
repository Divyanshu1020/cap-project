import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders';

  constructor(private http: HttpClient) {}

  /** Get all orders */
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  /** Get a single order */
  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  /** Place an order from current cart */
  placeOrder(customerName: string, customerEmail: string): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, {
      customer_name: customerName,
      customer_email: customerEmail,
    });
  }

  /** Update order status (admin) */
  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/status`, { status });
  }
}
