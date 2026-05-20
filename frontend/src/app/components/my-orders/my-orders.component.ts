import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Order } from '../../models/models';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, DatePipe, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule,
    MatDividerModule, MatChipsModule,
    LoadingSpinnerComponent,
  ],
  template: `
    <div class="page-container">
      <div class="page-header animate-fade-in">
        <h1>My Orders</h1>
        <p>Track the status of your orders</p>
      </div>

      <!-- Loading State -->
      <app-loading-spinner *ngIf="loading" message="Loading your orders..."></app-loading-spinner>

      <!-- Empty State -->
      <div class="empty-state animate-fade-in" *ngIf="!loading && orders.length === 0">
        <mat-icon>receipt_long</mat-icon>
        <h3>No orders yet</h3>
        <p>You haven't placed any orders. Start shopping to see your orders here!</p>
        <a mat-raised-button color="primary" routerLink="/" style="margin-top: 16px">
          <mat-icon>menu_book</mat-icon> Browse Books
        </a>
      </div>

      <!-- Orders List -->
      <div class="orders-list" *ngIf="!loading && orders.length > 0">
        <mat-card *ngFor="let order of orders; let i = index"
                  class="order-card animate-slide-up"
                  [style.animation-delay]="(i * 0.08) + 's'">

          <!-- Order Header -->
          <div class="order-header">
            <div class="order-info">
              <span class="order-id">Order #{{ order.id }}</span>
              <span class="order-date">
                <mat-icon>calendar_today</mat-icon>
                {{ order.created_at | date:'mediumDate' }}
              </span>
            </div>
            <span class="status-badge"
                  [ngClass]="order.status.toLowerCase()">
              {{ order.status }}
            </span>
          </div>

          <mat-divider></mat-divider>

          <!-- Status Timeline -->
          <div class="status-timeline">
            <div class="timeline-step"
                 *ngFor="let step of statusSteps"
                 [class.active]="isStepActive(order.status, step)"
                 [class.current]="order.status === step">
              <div class="timeline-dot">
                <mat-icon *ngIf="isStepActive(order.status, step) && order.status !== step">check</mat-icon>
                <mat-icon *ngIf="order.status === step">{{ getStepIcon(step) }}</mat-icon>
              </div>
              <span class="timeline-label">{{ step }}</span>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Order Items -->
          <div class="order-items">
            <div class="order-item" *ngFor="let item of order.items">
              <div class="item-details">
                <mat-icon class="item-icon">book</mat-icon>
                <div>
                  <span class="item-title">{{ item.book_title }}</span>
                  <span class="item-qty">Qty: {{ item.quantity }}</span>
                </div>
              </div>
              <span class="item-price">{{ item.price * item.quantity | currency }}</span>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Order Footer -->
          <div class="order-footer">
            <span class="total-label">Total</span>
            <span class="total-amount">{{ order.total_amount | currency }}</span>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .order-card {
      padding: 0 !important;
      overflow: hidden;
      transition: var(--transition);
    }

    .order-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-hover);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
    }

    .order-info {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .order-id {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .order-date {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .order-date mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    /* Status Timeline */
    .status-timeline {
      display: flex;
      justify-content: space-between;
      padding: 20px 24px;
      position: relative;
    }

    .status-timeline::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 48px;
      right: 48px;
      height: 3px;
      background: var(--bg-surface);
      transform: translateY(-8px);
    }

    .timeline-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      z-index: 1;
      flex: 1;
    }

    .timeline-dot {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--bg-surface);
      border: 2px solid var(--bg-hover);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
    }

    .timeline-dot mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: var(--text-muted);
    }

    .timeline-step.active .timeline-dot {
      background: rgba(102, 187, 106, 0.2);
      border-color: var(--success);
    }

    .timeline-step.active .timeline-dot mat-icon {
      color: var(--success);
    }

    .timeline-step.current .timeline-dot {
      background: rgba(255, 143, 0, 0.2);
      border-color: var(--accent);
      box-shadow: 0 0 12px rgba(255, 143, 0, 0.3);
      animation: pulse 2s ease-in-out infinite;
    }

    .timeline-step.current .timeline-dot mat-icon {
      color: var(--accent);
    }

    .timeline-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .timeline-step.active .timeline-label,
    .timeline-step.current .timeline-label {
      color: var(--text-primary);
    }

    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 8px rgba(255, 143, 0, 0.2); }
      50% { box-shadow: 0 0 20px rgba(255, 143, 0, 0.4); }
    }

    /* Order Items */
    .order-items {
      padding: 16px 24px;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
    }

    .order-item:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }

    .item-details {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .item-icon {
      color: var(--primary-light);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .item-title {
      display: block;
      font-weight: 500;
      color: var(--text-primary);
      font-size: 0.95rem;
    }

    .item-qty {
      display: block;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .item-price {
      font-weight: 600;
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    /* Order Footer */
    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: rgba(255, 255, 255, 0.02);
    }

    .total-label {
      font-weight: 600;
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .total-amount {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--accent);
    }

    /* Dividers */
    mat-divider {
      border-color: rgba(255, 255, 255, 0.06) !important;
    }

    /* Responsive */
    @media (max-width: 600px) {
      .order-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        padding: 16px;
      }

      .status-timeline {
        padding: 16px;
      }

      .status-timeline::before {
        left: 32px;
        right: 32px;
      }

      .timeline-label {
        font-size: 0.65rem;
      }

      .timeline-dot {
        width: 28px;
        height: 28px;
      }

      .order-items,
      .order-footer {
        padding: 12px 16px;
      }

      .item-details {
        gap: 8px;
      }

      .item-title {
        font-size: 0.85rem;
      }
    }
  `],
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;

  /** Status progression steps (excluding Cancelled) */
  statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

  constructor(
    private orderService: OrderService,
    private auth: AuthService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  /** Fetch orders for the logged-in user */
  loadOrders(): void {
    const user = this.auth.currentUser;
    if (!user) return;

    this.loading = true;
    this.orderService.getMyOrders(user.id).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load orders');
        this.loading = false;
      },
    });
  }

  /** Check if a timeline step is active (completed or current) */
  isStepActive(currentStatus: string, step: string): boolean {
    if (currentStatus === 'Cancelled') return false;
    const currentIdx = this.statusSteps.indexOf(currentStatus);
    const stepIdx = this.statusSteps.indexOf(step);
    return stepIdx <= currentIdx;
  }

  /** Get the icon for a timeline step */
  getStepIcon(step: string): string {
    switch (step) {
      case 'Pending': return 'schedule';
      case 'Processing': return 'settings';
      case 'Shipped': return 'local_shipping';
      case 'Delivered': return 'check_circle';
      default: return 'circle';
    }
  }
}
