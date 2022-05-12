import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from 'src/app/pages/customers/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private http: HttpClient) { }

  getAll() {
      return this.http.get<Customer[]>(`/customers`);
  }

  getById(id: number) {
      return this.http.get<Customer>(`/customers/${id}`);
  }

  create(customer: Customer) {
      return this.http.post<Customer>(`/customers`, customer);
  }

  update(customer: Customer) {
      return this.http.put<Customer>(`/customers/${customer.id}`, customer);
  }

  delete(id: number) {
      return this.http.delete<Customer>(`/customers/${id}`);
  }
}
