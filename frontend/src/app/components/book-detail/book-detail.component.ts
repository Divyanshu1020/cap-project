import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { BookService } from '../../services/book.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Book } from '../../models/models';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatDividerModule,
    LoadingSpinnerComponent,
  ],
  template: `
    <div class="page-container">
      <!-- Back Button -->
      <a mat-button routerLink="/" class="back-btn animate-fade-in">
        <mat-icon>arrow_back</mat-icon> Back to Books
      </a>

      <app-loading-spinner *ngIf="loading" message="Loading book details..."></app-loading-spinner>

      <div class="detail-grid animate-slide-up" *ngIf="!loading && book">
        <!-- Book Image -->
        <div class="image-section">
          <img [src]="book.image_url" [alt]="book.title" class="detail-image"
               (error)="onImageError($event)">
        </div>

        <!-- Book Info -->
        <div class="info-section">
          <mat-chip *ngIf="book.category" class="detail-category">{{ book.category }}</mat-chip>
          <h1 class="detail-title">{{ book.title }}</h1>
          <p class="detail-author">by {{ book.author }}</p>

          <mat-divider></mat-divider>

          <div class="price-stock">
            <span class="detail-price">{{ book.price | currency }}</span>
            <span class="detail-stock" [class.out-of-stock]="book.stock === 0"
                  [class.low-stock]="book.stock > 0 && book.stock < 5">
              <mat-icon>{{ book.stock > 0 ? 'check_circle' : 'cancel' }}</mat-icon>
              {{ book.stock > 0 ? book.stock + ' in stock' : 'Out of stock' }}
            </span>
          </div>

          <p class="detail-description">{{ book.description }}</p>

          <div class="detail-actions">
            <button mat-raised-button color="primary"
                    (click)="addToCart()"
                    [disabled]="book.stock === 0"
                    class="add-cart-btn">
              <mat-icon>add_shopping_cart</mat-icon>
              {{ book.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
            </button>
            <a mat-outlined-button routerLink="/cart">
              <mat-icon>shopping_cart</mat-icon>
              View Cart
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .back-btn {
      color: var(--text-secondary);
      margin-bottom: 24px;
      display: inline-flex;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 48px;
      align-items: start;
    }

    .image-section {
      position: sticky;
      top: 88px;
    }

    .detail-image {
      width: 100%;
      max-height: 500px;
      object-fit: cover;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow);
    }

    .detail-category {
      margin-bottom: 12px;
    }

    .detail-title {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 8px;
    }

    .detail-author {
      font-size: 1.1rem;
      color: var(--text-secondary);
      margin-bottom: 24px;
    }

    mat-divider {
      margin: 24px 0;
      border-color: rgba(255, 255, 255, 0.08);
    }

    .price-stock {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 24px;
    }

    .detail-price {
      font-size: 2rem;
      font-weight: 700;
      color: var(--accent);
    }

    .detail-stock {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.95rem;
      color: var(--success);
      font-weight: 500;
    }

    .detail-stock.low-stock {
      color: var(--warning);
    }

    .detail-stock.out-of-stock {
      color: var(--danger);
    }

    .detail-stock mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .detail-description {
      color: var(--text-secondary);
      line-height: 1.7;
      font-size: 1rem;
      margin-bottom: 32px;
    }

    .detail-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .add-cart-btn {
      min-width: 180px;
    }

    @media (max-width: 768px) {
      .detail-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .image-section {
        position: static;
      }

      .detail-title {
        font-size: 1.5rem;
      }

      .detail-price {
        font-size: 1.5rem;
      }
    }
  `],
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.bookService.getBook(id).subscribe({
      next: book => {
        this.book = book;
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load book details');
        this.loading = false;
      },
    });
  }

  addToCart(): void {
    if (!this.book) return;
    this.cartService.addToCart(this.book.id).subscribe({
      next: () => this.toast.success(`"${this.book!.title}" added to cart!`),
      error: (err) => this.toast.error(err.error?.error || 'Failed to add to cart'),
    });
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://picsum.photos/seed/fallback/300/450';
  }
}
