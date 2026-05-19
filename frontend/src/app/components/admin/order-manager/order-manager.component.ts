import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { OrderService } from '../../../services/order.service';
import { ToastService } from '../../../services/toast.service';
import { Order } from '../../../models/models';

@Component({
  selector: 'app-order-manager',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, DatePipe, FormsModule, RouterLink,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatSelectModule, MatFormFieldModule, LoadingSpinnerComponent,
  ],
  template: `
    <div class="page-container">
      <div class="page-header animate-fade-in">
        <h1>Manage Orders</h1>
        <p>View and update order statuses</p>
      </div>
      <a mat-button routerLink="/admin" class="back-link"><mat-icon>arrow_back</mat-icon> Back to Dashboard</a>

      <app-loading-spinner *ngIf="loading" message="Loading orders..."></app-loading-spinner>

      <div class="empty-state" *ngIf="!loading && orders.length === 0">
        <mat-icon>receipt_long</mat-icon>
        <h3>No orders yet</h3>
        <p>Orders will appear here once customers start buying</p>
      </div>

      <div class="orders-list animate-slide-up" *ngIf="!loading && orders.length > 0">
        <mat-card class="order-card" *ngFor="let order of orders">
          <div class="order-header">
            <div class="order-meta">
              <span class="order-id">Order #{{ order.id }}</span>
              <span class="order-date">{{ order.created_at | date:'medium' }}</span>
            </div>
            <span class="status-badge" [ngClass]="order.status.toLowerCase()">{{ order.status }}</span>
          </div>

          <div class="order-customer">
            <mat-icon>person</mat-icon>
            <span>{{ order.customer_name }} ({{ order.customer_email }})</span>
          </div>

          <div class="order-items-list">
            <div class="oi" *ngFor="let item of order.items">
              <span>{{ item.book_title }} × {{ item.quantity }}</span>
              <span>{{ item.price * item.quantity | currency }}</span>
            </div>
          </div>

          <div class="order-footer">
            <span class="order-total">Total: {{ order.total_amount | currency }}</span>
            <mat-form-field appearance="outline" class="status-select">
              <mat-label>Status</mat-label>
              <mat-select [value]="order.status" (selectionChange)="updateStatus(order, $event.value)">
                <mat-option *ngFor="let s of statuses" [value]="s">{{ s }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .back-link{color:var(--text-secondary);margin-bottom:20px;display:inline-flex}
    .orders-list{display:flex;flex-direction:column;gap:16px}
    .order-card{padding:20px!important}
    .order-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
    .order-meta{display:flex;flex-direction:column;gap:4px}
    .order-id{font-weight:700;font-size:1.05rem;color:var(--accent)}
    .order-date{font-size:.82rem;color:var(--text-muted)}
    .order-customer{display:flex;align-items:center;gap:8px;color:var(--text-secondary);font-size:.92rem;margin-bottom:12px}
    .order-customer mat-icon{font-size:18px;width:18px;height:18px}
    .order-items-list{background:var(--bg-surface);border-radius:var(--radius-sm);padding:12px;margin-bottom:16px}
    .oi{display:flex;justify-content:space-between;padding:4px 0;font-size:.9rem;color:var(--text-secondary)}
    .order-footer{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
    .order-total{font-weight:700;font-size:1.2rem;color:var(--text-primary)}
    .status-select{width:180px;margin:0}
  `],
})
export class OrderManagerComponent implements OnInit {
  orders: Order[] = [];
  statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  loading = false;

  constructor(private orderService: OrderService, private toast: ToastService) {}

  ngOnInit() { this.loadOrders(); }

  loadOrders() {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: o => { this.orders = o; this.loading = false; },
      error: () => { this.toast.error('Failed to load orders'); this.loading = false; },
    });
  }

  updateStatus(order: Order, status: string) {
    this.orderService.updateOrderStatus(order.id, status).subscribe({
      next: updated => {
        order.status = updated.status;
        this.toast.success(`Order #${order.id} → ${status}`);
      },
      error: e => this.toast.error(e.error?.error || 'Failed to update status'),
    });
  }
}
