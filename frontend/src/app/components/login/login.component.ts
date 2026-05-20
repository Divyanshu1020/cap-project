import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
  ],
  template: `
    <div class="page-container">
      <div class="auth-wrapper animate-slide-up">
        <mat-card class="auth-card">
          <div class="auth-header">
            <mat-icon class="auth-icon">login</mat-icon>
            <h1>Welcome Back</h1>
            <p>Sign in to your BookNest account</p>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput [(ngModel)]="email" type="email" placeholder="you@example.com">
            <mat-icon matPrefix>email</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput [(ngModel)]="password" [type]="hidePass ? 'password' : 'text'">
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix (click)="hidePass = !hidePass">
              <mat-icon>{{ hidePass ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>

          <button mat-raised-button color="primary" class="auth-btn"
                  (click)="onLogin()" [disabled]="loading">
            <mat-icon>{{ loading ? 'hourglass_empty' : 'login' }}</mat-icon>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>

          <p class="auth-footer">
            Don't have an account? <a routerLink="/signup">Create one</a>
          </p>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper{display:flex;justify-content:center;align-items:center;min-height:calc(100vh - 120px)}
    .auth-card{padding:40px!important;max-width:420px;width:100%}
    .auth-header{text-align:center;margin-bottom:32px}
    .auth-icon{font-size:48px;width:48px;height:48px;color:var(--accent);margin-bottom:12px}
    .auth-header h1{font-size:1.6rem;font-weight:700;margin-bottom:4px}
    .auth-header p{color:var(--text-secondary);font-size:.95rem}
    .auth-btn{width:100%;padding:12px!important;font-size:1rem!important;margin-top:8px}
    .auth-footer{text-align:center;margin-top:20px;color:var(--text-secondary);font-size:.9rem}
    .auth-footer a{color:var(--accent);font-weight:600}
  `],
})
export class LoginComponent {
  email = '';
  password = '';
  hidePass = true;
  loading = false;

  constructor(private auth: AuthService, private toast: ToastService, private router: Router) {}

  onLogin() {
    if (!this.email.trim() || !this.password.trim()) {
      this.toast.error('Please fill in all fields');
      return;
    }
    this.loading = true;
    this.auth.login(this.email.trim(), this.password).subscribe({
      next: () => {
        this.toast.success('Login successful!');
        this.router.navigate(['/']);
      },
      error: e => {
        this.toast.error(e.error?.error || 'Login failed');
        this.loading = false;
      },
    });
  }
}
