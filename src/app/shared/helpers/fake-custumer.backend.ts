import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { Customer } from 'src/app/pages/customers/customer.interface';

@Injectable()
export class FakeCustomerInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // some initial default products
    const defaultCustomers = [
      { id: 1, name: 'Heliomar', lastName: 'Marques' },
      { id: 2, name: 'Angelina', lastName: 'Marques' },
      { id: 3, name: 'Lázaro', lastName: 'Marques' },
      { id: 4, name: 'Laura', lastName: 'Marques' },
    ];

    // array in local storage for all customers
    const localRecords = localStorage.getItem('customers');
    let customers = (localRecords ? JSON.parse(localRecords) : defaultCustomers) as Customer[];

    const { url, method, headers, body } = request;

    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('/customers') && method === 'GET':
          return getCustomers();
        case url.match(/\/customers\/\d+$/) && method === 'GET':
          return getCustomerById();
        case url.endsWith('/customers') && method === 'POST':
          return createCustomer();
        case url.match(/\/customers\/\d+$/) && method === 'PUT':
          return updateCustomer();
        case url.match(/\/customers\/\d+$/) && method === 'DELETE':
          return deleteCustomer();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function getCustomers() {
      return ok(customers);
    }

    function getCustomerById() {
      const result = customers.find((x: { id: number; }) => x.id === idFromUrl());
      return ok(result);
    }

    function createCustomer() {
      const record = body;
      record.id = customers.length ? Math.max(...customers.map((x: { id: any; }) => x.id)) + 1 : 1;
      customers.push(record);
      localStorage.setItem('customers', JSON.stringify(customers));

      return ok(record);
    }

    function updateCustomer() {
      const record = body;
      const index = customers.findIndex((x: { id: number; }) => x.id === idFromUrl());
      customers[index] = record;
      localStorage.setItem('customers', JSON.stringify(customers));

      return ok(record);
    }

    function deleteCustomer() {
      customers = customers.filter((x: { id: number; }) => x.id !== idFromUrl());
      localStorage.setItem('customers', JSON.stringify(customers));
      return ok();
    }

    // helper functions

    function ok(body?: Customer | Customer[]) {
      return of(new HttpResponse({ status: 200, body }))
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}

export const FakeCustomerProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeCustomerInterceptor,
  multi: true
};
