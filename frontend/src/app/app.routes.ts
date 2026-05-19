import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { BookFormComponent } from './components/admin/book-form/book-form.component';
import { OrderManagerComponent } from './components/admin/order-manager/order-manager.component';

export const routes: Routes = [
  { path: '', component: BookListComponent },
  { path: 'books/:id', component: BookDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/books', component: BookFormComponent },
  { path: 'admin/orders', component: OrderManagerComponent },
  { path: '**', redirectTo: '' },
];
