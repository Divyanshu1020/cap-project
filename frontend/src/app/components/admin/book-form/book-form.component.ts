import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { BookService } from '../../../services/book.service';
import { ToastService } from '../../../services/toast.service';
import { Book } from '../../../models/models';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, FormsModule, RouterLink,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDividerModule,
    LoadingSpinnerComponent,
  ],
  template: `
    <div class="page-container">
      <div class="page-header animate-fade-in">
        <h1>Manage Books</h1>
        <p>Add, edit, or delete books from the catalog</p>
      </div>

      <a mat-button routerLink="/admin" class="back-link"><mat-icon>arrow_back</mat-icon> Back to Dashboard</a>

      <!-- Book Form -->
      <mat-card class="form-card animate-slide-up">
        <h2>{{ editingId ? 'Edit Book' : 'Add New Book' }}</h2>
        <mat-divider></mat-divider>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Title</mat-label>
            <input matInput [(ngModel)]="form.title" required>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Author</mat-label>
            <input matInput [(ngModel)]="form.author" required>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Price ($)</mat-label>
            <input matInput type="number" [(ngModel)]="form.price" min="0" step="0.01" required>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Stock</mat-label>
            <input matInput type="number" [(ngModel)]="form.stock" min="0" required>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select [(ngModel)]="form.category">
              <mat-option value="">None</mat-option>
              <mat-option *ngFor="let c of categories" [value]="c">{{c}}</mat-option>
              <mat-option value="__custom">+ Custom...</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" *ngIf="form.category === '__custom'">
            <mat-label>Custom Category</mat-label>
            <input matInput [(ngModel)]="customCategory">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Image URL</mat-label>
            <input matInput [(ngModel)]="form.image_url">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput [(ngModel)]="form.description" rows="3"></textarea>
          </mat-form-field>
        </div>
        <div class="form-actions">
          <button mat-raised-button color="primary" (click)="saveBook()" [disabled]="saving">
            <mat-icon>{{ editingId ? 'save' : 'add' }}</mat-icon>
            {{ saving ? 'Saving...' : (editingId ? 'Update Book' : 'Add Book') }}
          </button>
          <button mat-button *ngIf="editingId" (click)="cancelEdit()">Cancel</button>
        </div>
      </mat-card>

      <!-- Books Table -->
      <app-loading-spinner *ngIf="loading" message="Loading books..."></app-loading-spinner>

      <mat-card class="table-card animate-slide-up" *ngIf="!loading && books.length > 0">
        <table mat-table [dataSource]="books" class="books-table">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let b">{{ b.id }}</td>
          </ng-container>
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let b">{{ b.title }}</td>
          </ng-container>
          <ng-container matColumnDef="author">
            <th mat-header-cell *matHeaderCellDef>Author</th>
            <td mat-cell *matCellDef="let b">{{ b.author }}</td>
          </ng-container>
          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef>Price</th>
            <td mat-cell *matCellDef="let b">{{ b.price | currency }}</td>
          </ng-container>
          <ng-container matColumnDef="stock">
            <th mat-header-cell *matHeaderCellDef>Stock</th>
            <td mat-cell *matCellDef="let b">{{ b.stock }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let b">
              <button mat-icon-button (click)="editBook(b)" color="primary"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button (click)="deleteBook(b)" color="warn"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .back-link{color:var(--text-secondary);margin-bottom:20px;display:inline-flex}
    .form-card,.table-card{padding:24px!important;margin-bottom:24px}
    .form-card h2{font-size:1.15rem;font-weight:600;margin-bottom:12px}
    .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;margin-top:16px}
    .full-width{grid-column:1/-1}
    .form-actions{display:flex;gap:12px;margin-top:8px}
    .books-table{width:100%}
    @media(max-width:768px){.form-grid{grid-template-columns:1fr}}
  `],
})
export class BookFormComponent implements OnInit {
  books: Book[] = [];
  categories = ['Fiction','Non-Fiction','Science Fiction','Fantasy','Romance','Self-Help','Technology','Business'];
  displayedColumns = ['id','title','author','price','stock','actions'];
  loading = false;
  saving = false;
  editingId: number | null = null;
  customCategory = '';
  form = { title: '', author: '', description: '', price: 0, stock: 0, image_url: '', category: '' };

  constructor(private bookService: BookService, private toast: ToastService) {}

  ngOnInit() { this.loadBooks(); }

  loadBooks() {
    this.loading = true;
    this.bookService.getBooks(1, 100).subscribe({
      next: r => { this.books = r.books; this.loading = false; },
      error: () => { this.toast.error('Failed to load books'); this.loading = false; },
    });
  }

  saveBook() {
    const cat = this.form.category === '__custom' ? this.customCategory : this.form.category;
    const payload = { ...this.form, category: cat };
    this.saving = true;

    const obs = this.editingId
      ? this.bookService.updateBook(this.editingId, payload)
      : this.bookService.createBook(payload);

    obs.subscribe({
      next: () => {
        this.toast.success(this.editingId ? 'Book updated!' : 'Book added!');
        this.resetForm();
        this.loadBooks();
        this.saving = false;
      },
      error: e => { this.toast.error(e.error?.error || 'Failed to save'); this.saving = false; },
    });
  }

  editBook(book: Book) {
    this.editingId = book.id;
    this.form = {
      title: book.title, author: book.author, description: book.description || '',
      price: book.price, stock: book.stock, image_url: book.image_url || '', category: book.category || '',
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteBook(book: Book) {
    if (!confirm(`Delete "${book.title}"?`)) return;
    this.bookService.deleteBook(book.id).subscribe({
      next: () => { this.toast.success('Book deleted'); this.loadBooks(); },
      error: () => this.toast.error('Failed to delete book'),
    });
  }

  cancelEdit() { this.editingId = null; this.resetForm(); }

  private resetForm() {
    this.editingId = null;
    this.customCategory = '';
    this.form = { title: '', author: '', description: '', price: 0, stock: 0, image_url: '', category: '' };
  }
}
