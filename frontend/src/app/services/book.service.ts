import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, BookListResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class BookService {
  private apiUrl = 'http://localhost:5000/api/books';

  constructor(private http: HttpClient) {}

  /** Get paginated & filtered book list */
  getBooks(page = 1, perPage = 8, search = '', category = ''): Observable<BookListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (search) params = params.set('search', search);
    if (category) params = params.set('category', category);

    return this.http.get<BookListResponse>(this.apiUrl, { params });
  }

  /** Get a single book by ID */
  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  /** Get all unique categories */
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  /** Create a new book (admin) */
  createBook(book: Partial<Book>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  /** Update an existing book (admin) */
  updateBook(id: number, book: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  /** Delete a book (admin) */
  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
