import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, RouterLink, RouterLinkActive,
    MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule,
  ],
  template: `
    <mat-toolbar class="navbar">
      <div class="navbar-inner">
        <!-- Logo -->
        <a routerLink="/" class="logo">
          <mat-icon class="logo-icon">menu_book</mat-icon>
          <span class="logo-text">Book<span class="logo-accent">Nest</span></span>
        </a>

        <!-- Nav Links -->
        <nav class="nav-links">
          <a mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <mat-icon>home</mat-icon>
            <span>Home</span>
          </a>
          <!-- Admin link: only visible to admin -->
          <a mat-button routerLink="/admin" routerLinkActive="active" *ngIf="auth.isAdmin">
            <mat-icon>dashboard</mat-icon>
            <span>Admin</span>
          </a>
        </nav>

        <!-- Cart Button -->
        <a mat-icon-button routerLink="/cart" class="cart-btn"
           [matBadge]="cartCount"
           [matBadgeHidden]="cartCount === 0"
           matBadgeColor="accent"
           matBadgeSize="small">
          <mat-icon>shopping_cart</mat-icon>
        </a>

        <!-- Auth Buttons -->
        <div class="auth-area">
          <!-- Not logged in -->
          <ng-container *ngIf="!auth.isLoggedIn">
            <a mat-button routerLink="/login" class="auth-btn">
              <mat-icon>login</mat-icon>
              <span>Login</span>
            </a>
            <a mat-raised-button color="primary" routerLink="/signup" class="signup-btn">
              <mat-icon>person_add</mat-icon>
              <span>Sign Up</span>
            </a>
          </ng-container>

          <!-- Logged in -->
          <ng-container *ngIf="auth.isLoggedIn">
            <span class="user-name">
              <mat-icon>account_circle</mat-icon>
              {{ auth.currentUser?.name }}
            </span>
            <button mat-button class="logout-btn" (click)="onLogout()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          </ng-container>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 64px;
      padding: 0 24px;
    }

    .navbar-inner {
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      height: 100%;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: inherit;
      margin-right: auto;
    }

    .logo-icon {
      color: var(--accent);
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .logo-text {
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .logo-accent {
      color: var(--accent);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-right: 12px;
    }

    .nav-links a {
      color: var(--text-secondary);
      font-weight: 500;
      transition: var(--transition);
      border-radius: var(--radius-sm);
    }

    .nav-links a:hover {
      color: var(--text-primary);
      background: rgba(255, 255, 255, 0.05);
    }

    .nav-links a.active {
      color: var(--accent);
      background: rgba(255, 143, 0, 0.1);
    }

    .nav-links a mat-icon {
      margin-right: 4px;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .cart-btn {
      color: var(--text-primary) !important;
      transition: var(--transition);
      margin-right: 8px;
    }

    .cart-btn:hover {
      color: var(--accent) !important;
      transform: scale(1.1);
    }

    .auth-area {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .auth-btn {
      color: var(--text-secondary) !important;
    }

    .signup-btn {
      font-size: 0.85rem !important;
    }

    .user-name {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--accent);
      font-weight: 600;
      font-size: 0.9rem;
    }

    .user-name mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .logout-btn {
      color: var(--text-secondary) !important;
    }

    @media (max-width: 600px) {
      .nav-links a span, .auth-btn span, .signup-btn span, .logout-btn span {
        display: none;
      }
      .user-name {
        font-size: 0;
      }
      .navbar {
        padding: 0 12px;
      }
    }
  `],
})
export class NavbarComponent {
  cartCount = 0;

  constructor(
    public auth: AuthService,
    private cartService: CartService,
    private toast: ToastService,
    private router: Router,
  ) {
    this.cartService.cartCount$.subscribe(c => this.cartCount = c);
  }

  onLogout(): void {
    this.auth.logout();
    this.toast.info('Logged out successfully');
    this.router.navigate(['/']);
  }
}
