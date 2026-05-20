import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CartItem } from '../../models/models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, FormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatDividerModule,
    LoadingSpinnerComponent,
  ],
  template: `
    <div class="page-container">
      <div class="page-header animate-fade-in">
        <h1>Checkout</h1>
        <p>Complete your order</p>
      </div>

      <app-loading-spinner *ngIf="loading" message="Loading..."></app-loading-spinner>

      <!-- Success State -->
      <div class="success-state animate-slide-up" *ngIf="orderPlaced">
        <mat-icon class="success-icon">check_circle</mat-icon>
        <h2>Order Placed Successfully!</h2>
        <p>Order #{{ orderId }} has been placed. Thank you for shopping with BookNest!</p>
        <a mat-raised-button color="primary" routerLink="/" style="margin-top:24px">
          <mat-icon>menu_book</mat-icon> Continue Shopping
        </a>
      </div>

      <!-- Checkout Form -->
      <div class="checkout-layout" *ngIf="!loading && !orderPlaced && items.length > 0">
        <mat-card class="checkout-form animate-slide-up">
          <h2><mat-icon>person</mat-icon> Customer Details</h2>
          <mat-divider></mat-divider>
          <mat-form-field appearance="outline">
            <mat-label>Full Name</mat-label>
            <input matInput [(ngModel)]="customerName" placeholder="John Doe" readonly>
            <mat-icon matPrefix>badge</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Email Address</mat-label>
            <input matInput [(ngModel)]="customerEmail" type="email" placeholder="john@example.com" readonly>
            <mat-icon matPrefix>email</mat-icon>
          </mat-form-field>

          <h2 style="margin-top:24px"><mat-icon>home</mat-icon> Shipping Details</h2>
          <mat-divider></mat-divider>
          <mat-form-field appearance="outline">
            <mat-label>Shipping Address</mat-label>
            <textarea matInput [(ngModel)]="address" rows="2" placeholder="123 Main St, City, Country" required></textarea>
            <mat-icon matPrefix>location_on</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Payment Method</mat-label>
            <input matInput [(ngModel)]="paymentMethod" placeholder="Cash on Delivery" required>
            <mat-icon matPrefix>payment</mat-icon>
          </mat-form-field>

          <h2 style="margin-top:24px"><mat-icon>list_alt</mat-icon> Order Items</h2>
          <mat-divider></mat-divider>
          <div class="order-item" *ngFor="let item of items">
            <span class="oi-title">{{ item.book.title }} x {{ item.quantity }}</span>
            <span class="oi-price">{{ item.book.price * item.quantity | currency }}</span>
          </div>
          <mat-divider></mat-divider>
          <div class="order-item total">
            <span>Total</span>
            <span>{{ totalPrice | currency }}</span>
          </div>

          <button mat-raised-button color="primary" class="place-btn"
                  (click)="placeOrder()"
                  [disabled]="placing || !address.trim() || !paymentMethod.trim()">
            <mat-icon>{{ placing ? 'hourglass_empty' : 'shopping_bag' }}</mat-icon>
            {{ placing ? 'Placing Order...' : 'Place Order' }}
          </button>
        </mat-card>
      </div>

      <div class="empty-state" *ngIf="!loading && !orderPlaced && items.length === 0">
        <mat-icon>remove_shopping_cart</mat-icon>
        <h3>Nothing to checkout</h3>
        <p>Your cart is empty</p>
        <a mat-raised-button color="primary" routerLink="/" style="margin-top:16px">Browse Books</a>
      </div>
    </div>
  `,
  styles: [`
    .checkout-layout{max-width:640px;margin:0 auto}
    .checkout-form{padding:32px!important}
    .checkout-form h2{display:flex;align-items:center;gap:8px;font-size:1.15rem;font-weight:600;margin-bottom:16px}
    mat-divider{margin:8px 0 20px;border-color:rgba(255,255,255,.08)}
    .order-item{display:flex;justify-content:space-between;padding:10px 0;font-size:.95rem;color:var(--text-secondary)}
    .order-item.total{font-weight:700;font-size:1.2rem;color:var(--accent);padding-top:16px}
    .oi-title{flex:1}
    .place-btn{width:100%;margin-top:24px;padding:12px!important;font-size:1rem!important}
    .success-state{text-align:center;padding:64px 24px}
    .success-icon{font-size:80px;width:80px;height:80px;color:var(--success);margin-bottom:16px}
    .success-state h2{font-size:1.5rem;margin-bottom:8px}
    .success-state p{color:var(--text-secondary);font-size:1.05rem}
  `],
})
export class CheckoutComponent implements OnInit {
  items: CartItem[] = [];
  totalPrice = 0;
  customerName = '';
  customerEmail = '';
  address = '';
  paymentMethod = 'Cash on Delivery';
  loading = false;
  placing = false;
  orderPlaced = false;
  orderId = 0;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router,
  ) {}

  ngOnInit() {
    // Auto-fill from logged-in user
    const user = this.auth.currentUser;
    if (user) {
      this.customerName = user.name;
      this.customerEmail = user.email;
    }

    this.loading = true;
    this.cartService.getCart().subscribe({
      next: r => { this.items = r.items; this.totalPrice = r.total_price; this.loading = false; },
      error: () => { this.toast.error('Failed to load cart'); this.loading = false; },
    });
  }

  placeOrder() {
    if (!this.address.trim() || !this.paymentMethod.trim()) {
      this.toast.error('Please fill in address and payment method');
      return;
    }
    this.placing = true;
    this.orderService.placeOrder(this.customerName.trim(), this.customerEmail.trim()).subscribe({
      next: order => {
        this.orderId = order.id;
        this.orderPlaced = true;
        this.placing = false;
        this.toast.success('Order placed successfully!');
      },
      error: e => {
        this.toast.error(e.error?.error || 'Failed to place order');
        this.placing = false;
      },
    });
  }
}
