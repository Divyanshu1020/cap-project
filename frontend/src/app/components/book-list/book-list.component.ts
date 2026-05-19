import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { BookCardComponent } from '../book-card/book-card.component';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { BookService } from '../../services/book.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Book } from '../../models/models';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule,
    MatPaginatorModule, MatButtonModule,
    BookCardComponent, LoadingSpinnerComponent,
  ],
  template: `
    <div class="page-container">
      <!-- Header -->
      <div class="page-header animate-fade-in">
        <h1>Discover Your Next Read</h1>
        <p>Browse our curated collection of books across all genres</p>
      </div>

      <!-- Search & Filter Bar -->
      <div class="search-bar animate-slide-up">
        <mat-form-field appearance="outline" class="search-field">
          <mat-icon matPrefix>search</mat-icon>
          <mat-label>Search by title or author...</mat-label>
          <input matInput
                 [ngModel]="searchTerm"
                 (ngModelChange)="onSearchChange($event)"
                 placeholder="Type to search...">
          <button mat-icon-button matSuffix *ngIf="searchTerm"
                  (click)="clearSearch()">
            <mat-icon>close</mat-icon>
          </button>
        </mat-form-field>

        <mat-form-field appearance="outline" class="category-field">
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="selectedCategory" (selectionChange)="onCategoryChange()">
            <mat-option value="">All Categories</mat-option>
            <mat-option *ngFor="let cat of categories" [value]="cat">{{ cat }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Loading -->
      <app-loading-spinner *ngIf="loading" message="Loading books..."></app-loading-spinner>

      <!-- Book Grid -->
      <div class="book-grid" *ngIf="!loading && books.length > 0">
        <app-book-card
          *ngFor="let book of books; let i = index"
          [book]="book"
          (addToCart)="onAddToCart($event)"
          [style.animation-delay]="(i * 0.05) + 's'"
          class="animate-slide-up">
        </app-book-card>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading && books.length === 0">
        <mat-icon>search_off</mat-icon>
        <h3>No books found</h3>
        <p>Try adjusting your search or filter criteria</p>
        <button mat-raised-button color="primary" (click)="clearFilters()" style="margin-top: 16px;">
          Clear Filters
        </button>
      </div>

      <!-- Paginator -->
      <mat-paginator
        *ngIf="!loading && totalBooks > 0"
        [length]="totalBooks"
        [pageSize]="pageSize"
        [pageIndex]="currentPage - 1"
        [pageSizeOptions]="[4, 8, 12, 16]"
        (page)="onPageChange($event)"
        showFirstLastButtons
        class="animate-fade-in">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .search-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 280px;
    }

    .category-field {
      min-width: 180px;
    }

    mat-paginator {
      margin-top: 32px;
      border-radius: var(--radius);
    }

    @media (max-width: 600px) {
      .search-bar {
        flex-direction: column;
      }

      .search-field, .category-field {
        min-width: 100%;
      }
    }
  `],
})
export class BookListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  categories: string[] = [];
  searchTerm = '';
  selectedCategory = '';
  loading = false;
  totalBooks = 0;
  currentPage = 1;
  pageSize = 8;

  private searchSubject = new Subject<string>();
  private searchSub!: Subscription;

  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadCategories();

    // Debounced search — waits 300ms after user stops typing
    this.searchSub = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.searchTerm = term;
        this.currentPage = 1;
        this.loading = true;
        return this.bookService.getBooks(1, this.pageSize, term, this.selectedCategory);
      }),
    ).subscribe({
      next: res => {
        this.books = res.books;
        this.totalBooks = res.total;
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to search books');
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks(this.currentPage, this.pageSize, this.searchTerm, this.selectedCategory)
      .subscribe({
        next: res => {
          this.books = res.books;
          this.totalBooks = res.total;
          this.loading = false;
        },
        error: () => {
          this.toast.error('Failed to load books');
          this.loading = false;
        },
      });
  }

  loadCategories(): void {
    this.bookService.getCategories().subscribe({
      next: cats => this.categories = cats,
    });
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchSubject.next('');
  }

  onCategoryChange(): void {
    this.currentPage = 1;
    this.loadBooks();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.currentPage = 1;
    this.loadBooks();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadBooks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onAddToCart(book: Book): void {
    this.cartService.addToCart(book.id).subscribe({
      next: () => this.toast.success(`"${book.title}" added to cart!`),
      error: (err) => this.toast.error(err.error?.error || 'Failed to add to cart'),
    });
  }
}
