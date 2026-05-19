import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookService } from '../../../services/book.service';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page-container">
      <div class="page-header animate-fade-in">
        <h1>Admin Dashboard</h1>
        <p>Manage your bookstore</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid animate-slide-up">
        <mat-card class="stat-card">
          <mat-icon class="stat-icon books-icon">menu_book</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{ totalBooks }}</span>
            <span class="stat-label">Total Books</span>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <mat-icon class="stat-icon orders-icon">receipt_long</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{ totalOrders }}</span>
            <span class="stat-label">Total Orders</span>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <mat-icon class="stat-icon revenue-icon">payments</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{ totalRevenue | currency }}</span>
            <span class="stat-label">Total Revenue</span>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <mat-icon class="stat-icon pending-icon">pending_actions</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{ pendingOrders }}</span>
            <span class="stat-label">Pending Orders</span>
          </div>
        </mat-card>
      </div>

      <!-- Quick Actions -->
      <h2 class="section-title animate-fade-in">Quick Actions</h2>
      <div class="actions-grid animate-slide-up">
        <a mat-raised-button color="primary" routerLink="/admin/books" class="action-btn">
          <mat-icon>library_add</mat-icon> Manage Books
        </a>
        <a mat-raised-button routerLink="/admin/orders" class="action-btn orders-btn">
          <mat-icon>local_shipping</mat-icon> Manage Orders
        </a>
        <a mat-raised-button routerLink="/" class="action-btn store-btn">
          <mat-icon>storefront</mat-icon> View Store
        </a>
      </div>

      <!-- Recent Orders -->
      <h2 class="section-title animate-fade-in" *ngIf="recentOrders.length">Recent Orders</h2>
      <div class="recent-orders animate-slide-up" *ngIf="recentOrders.length">
        <mat-card class="order-row" *ngFor="let order of recentOrders">
          <div class="order-id">#{{ order.id }}</div>
          <div class="order-customer">{{ order.customer_name }}</div>
          <div class="order-amount">{{ order.total_amount | currency }}</div>
          <span class="status-badge" [ngClass]="order.status.toLowerCase()">{{ order.status }}</span>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;margin-bottom:40px}
    .stat-card{display:flex;align-items:center;gap:16px;padding:24px!important;transition:var(--transition)}
    .stat-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-hover)}
    .stat-icon{font-size:40px;width:40px;height:40px;padding:12px;border-radius:var(--radius);box-sizing:content-box}
    .books-icon{background:rgba(66,165,245,.15);color:var(--info)}
    .orders-icon{background:rgba(171,71,188,.15);color:#ab47bc}
    .revenue-icon{background:rgba(102,187,106,.15);color:var(--success)}
    .pending-icon{background:rgba(255,167,38,.15);color:var(--warning)}
    .stat-info{display:flex;flex-direction:column}
    .stat-value{font-size:1.8rem;font-weight:700}
    .stat-label{font-size:.85rem;color:var(--text-secondary)}
    .section-title{font-size:1.3rem;font-weight:600;margin-bottom:16px;margin-top:8px}
    .actions-grid{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:40px}
    .action-btn{padding:12px 24px!important;font-size:.95rem!important}
    .orders-btn{background:rgba(171,71,188,.85)!important;color:#fff!important}
    .store-btn{background:var(--bg-surface)!important;color:var(--text-primary)!important}
    .recent-orders{display:flex;flex-direction:column;gap:12px}
    .order-row{display:flex;align-items:center;gap:16px;padding:16px!important}
    .order-id{font-weight:700;color:var(--accent);min-width:50px}
    .order-customer{flex:1;color:var(--text-secondary)}
    .order-amount{font-weight:600;min-width:80px;text-align:right}
  `],
})
export class AdminDashboardComponent implements OnInit {
  totalBooks = 0;
  totalOrders = 0;
  totalRevenue = 0;
  pendingOrders = 0;
  recentOrders: Order[] = [];

  constructor(private bookService: BookService, private orderService: OrderService) {}

  ngOnInit() {
    this.bookService.getBooks(1, 1).subscribe({ next: r => this.totalBooks = r.total });
    this.orderService.getOrders().subscribe({
      next: orders => {
        this.totalOrders = orders.length;
        this.totalRevenue = orders.reduce((s, o) => s + o.total_amount, 0);
        this.pendingOrders = orders.filter(o => o.status === 'Pending').length;
        this.recentOrders = orders.slice(0, 5);
      },
    });
  }
}
