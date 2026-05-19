import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Book } from '../../models/models';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],

  template: `
    <mat-card class="book-card" [routerLink]="['/books', book.id]">
      <div class="book-image-wrapper">
        <img [src]="book.image_url" [alt]="book.title" class="book-image" loading="lazy"
             (error)="onImageError($event)">
        <mat-chip class="category-chip" *ngIf="book.category">{{ book.category }}</mat-chip>
      </div>

      <mat-card-content class="book-info">
        <h3 class="book-title">{{ book.title }}</h3>
        <p class="book-author">by {{ book.author }}</p>

        <div class="book-footer">
          <span class="book-price">{{ book.price | currency }}</span>
          <span class="book-stock" [class.low-stock]="book.stock < 5">
            {{ book.stock > 0 ? book.stock + ' in stock' : 'Out of stock' }}
          </span>
        </div>
      </mat-card-content>

      <mat-card-actions class="book-actions">
        <button mat-raised-button color="primary"
                (click)="onAddToCart($event)"
                [disabled]="book.stock === 0">
          <mat-icon>add_shopping_cart</mat-icon>
          {{ book.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .book-card {
      cursor: pointer;
      transition: var(--transition);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .book-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-hover);
    }

    .book-image-wrapper {
      position: relative;
      width: 100%;
      height: 220px;
      overflow: hidden;
      background: var(--bg-surface);
    }

    .book-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .book-card:hover .book-image {
      transform: scale(1.05);
    }

    .category-chip {
      position: absolute;
      top: 12px;
      right: 12px;
      font-size: 0.7rem;
      height: 24px !important;
      background: rgba(15, 23, 41, 0.85) !important;
      backdrop-filter: blur(8px);
    }

    .book-info {
      flex: 1;
      padding: 16px !important;
    }

    .book-title {
      font-size: 1.05rem;
      font-weight: 600;
      margin-bottom: 4px;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .book-author {
      color: var(--text-secondary);
      font-size: 0.88rem;
      margin-bottom: 12px;
    }

    .book-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .book-price {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--accent);
    }

    .book-stock {
      font-size: 0.78rem;
      color: var(--success);
      font-weight: 500;
    }

    .book-stock.low-stock {
      color: var(--warning);
    }

    .book-actions {
      padding: 0 16px 16px !important;
    }

    .book-actions button {
      width: 100%;
    }
  `],
})
export class BookCardComponent {
  @Input() book!: Book;
  @Output() addToCart = new EventEmitter<Book>();

  onAddToCart(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.addToCart.emit(this.book);
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://picsum.photos/seed/fallback/300/450';
  }
}
