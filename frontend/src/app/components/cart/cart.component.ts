import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { CartItem } from '../../models/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, MatDividerModule,
    LoadingSpinnerComponent,
  ],
  template: `
    <div class="page-container">
      <div class="page-header animate-fade-in">
        <h1>Your Cart</h1>
        <p>Review your items before checkout</p>
      </div>
      <app-loading-spinner *ngIf="loading" message="Loading cart..."></app-loading-spinner>
      <div class="empty-state" *ngIf="!loading && items.length === 0">
        <mat-icon>shopping_cart</mat-icon>
        <h3>Your cart is empty</h3>
        <p>Start browsing and add some books!</p>
        <a mat-raised-button color="primary" routerLink="/" style="margin-top:16px">
          <mat-icon>menu_book</mat-icon> Browse Books
        </a>
      </div>
      <div class="cart-layout" *ngIf="!loading && items.length > 0">
        <div class="cart-items animate-slide-up">
          <mat-card class="cart-item" *ngFor="let item of items">
            <div class="item-image">
              <img [src]="item.book.image_url" [alt]="item.book.title" (error)="onImgErr($event)">
            </div>
            <div class="item-info">
              <h3><a [routerLink]="['/books', item.book.id]">{{ item.book.title }}</a></h3>
              <p class="item-author">by {{ item.book.author }}</p>
              <p class="item-price">{{ item.book.price | currency }} each</p>
            </div>
            <div class="item-controls">
              <div class="qty-controls">
                <button mat-icon-button (click)="changeQty(item,-1)" [disabled]="item.quantity<=1"><mat-icon>remove</mat-icon></button>
                <span class="qty-value">{{ item.quantity }}</span>
                <button mat-icon-button (click)="changeQty(item,1)" [disabled]="item.quantity>=item.book.stock"><mat-icon>add</mat-icon></button>
              </div>
              <span class="item-total">{{ item.book.price * item.quantity | currency }}</span>
              <button mat-icon-button color="warn" (click)="removeItem(item)"><mat-icon>delete_outline</mat-icon></button>
            </div>
          </mat-card>
        </div>
        <mat-card class="order-summary animate-slide-up">
          <h2>Order Summary</h2>
          <mat-divider></mat-divider>
          <div class="summary-row"><span>Items ({{totalItems}})</span><span>{{totalPrice | currency}}</span></div>
          <div class="summary-row"><span>Shipping</span><span class="free-ship">FREE</span></div>
          <mat-divider></mat-divider>
          <div class="summary-row total-row"><span>Total</span><span>{{totalPrice | currency}}</span></div>
          <a mat-raised-button color="primary" routerLink="/checkout" class="checkout-btn"><mat-icon>payment</mat-icon> Proceed to Checkout</a>
          <button mat-button (click)="clearCart()" class="clear-btn"><mat-icon>delete_sweep</mat-icon> Clear Cart</button>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .cart-layout{display:grid;grid-template-columns:1fr 360px;gap:32px;align-items:start}
    .cart-items{display:flex;flex-direction:column;gap:16px}
    .cart-item{display:flex;align-items:center;gap:16px;padding:16px!important}
    .item-image{width:80px;height:100px;border-radius:var(--radius-sm);overflow:hidden;flex-shrink:0}
    .item-image img{width:100%;height:100%;object-fit:cover}
    .item-info{flex:1;min-width:0}
    .item-info h3{font-size:1rem;font-weight:600;margin-bottom:4px}
    .item-info h3 a{color:var(--text-primary);transition:var(--transition)}
    .item-info h3 a:hover{color:var(--accent)}
    .item-author{font-size:.85rem;color:var(--text-secondary)}
    .item-price{font-size:.85rem;color:var(--text-muted);margin-top:4px}
    .item-controls{display:flex;align-items:center;gap:16px;flex-shrink:0}
    .qty-controls{display:flex;align-items:center;gap:4px;background:var(--bg-surface);border-radius:var(--radius-sm);padding:2px}
    .qty-value{min-width:32px;text-align:center;font-weight:600}
    .item-total{font-weight:700;font-size:1.1rem;color:var(--accent);min-width:80px;text-align:right}
    .order-summary{position:sticky;top:88px;padding:24px!important}
    .order-summary h2{font-size:1.2rem;font-weight:600;margin-bottom:16px}
    .summary-row{display:flex;justify-content:space-between;padding:12px 0;font-size:.95rem}
    .total-row{font-weight:700;font-size:1.2rem;color:var(--accent)}
    .free-ship{color:var(--success);font-weight:600}
    mat-divider{margin:4px 0;border-color:rgba(255,255,255,.08)}
    .checkout-btn{width:100%;margin-top:20px;padding:10px!important;font-size:1rem!important}
    .clear-btn{width:100%;margin-top:8px;color:var(--text-muted)!important}
    @media(max-width:768px){.cart-layout{grid-template-columns:1fr}.cart-item{flex-wrap:wrap}.item-controls{width:100%;justify-content:space-between;margin-top:8px}.order-summary{position:static}}
  `],
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  totalItems = 0;
  totalPrice = 0;
  loading = false;

  constructor(private cartService: CartService, private toast: ToastService) {}

  ngOnInit() { this.loadCart(); }

  loadCart() {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: r => { this.items = r.items; this.totalItems = r.total_items; this.totalPrice = r.total_price; this.loading = false; },
      error: () => { this.toast.error('Failed to load cart'); this.loading = false; },
    });
  }

  changeQty(item: CartItem, delta: number) {
    const newQty = item.quantity + delta;
    if (newQty < 1 || newQty > item.book.stock) return;
    this.cartService.updateCartItem(item.id, newQty).subscribe({
      next: () => this.loadCart(),
      error: e => this.toast.error(e.error?.error || 'Failed to update'),
    });
  }

  removeItem(item: CartItem) {
    this.cartService.removeCartItem(item.id).subscribe({
      next: () => { this.toast.info('"' + item.book.title + '" removed'); this.loadCart(); },
      error: () => this.toast.error('Failed to remove item'),
    });
  }

  clearCart() {
    this.cartService.clearCart().subscribe({
      next: () => { this.toast.info('Cart cleared'); this.loadCart(); },
      error: () => this.toast.error('Failed to clear cart'),
    });
  }

  onImgErr(e: Event) { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/fallback/300/450'; }
}
