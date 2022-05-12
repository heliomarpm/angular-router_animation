import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { FadeInAnimation } from 'src/app/shared/animations';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { PubSubService } from 'src/app/shared/services/pub-sub.service';
import { Customer } from './customer.interface';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  animations: [FadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class CustomersComponent implements OnInit, OnDestroy {
  customers: Customer[] = [];
  subscription!: Subscription;
  loading = false;

  constructor(
    private customerService: CustomerService,
    private pubSubService: PubSubService
  ) { }

  ngOnInit() {
    this.loadRecords();

    // reload products when updated
    this.subscription = this.pubSubService.on('customers-updated')
      .subscribe(() => { console.log('subscribe'); this.loadRecords() });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  deleteRecord(id: number) {
    (this.customers.find(x => x.id === id) as Customer).deleting = true;
    this.customerService.delete(id).subscribe(() => {
      // remove product from products array after deleting
      console.log('subscribe delete');
      this.customers = this.customers.filter(x => x.id !== id);
    });
  }

  private loadRecords() {
    console.log('load');
    this.customerService.getAll().subscribe(x => {
      console.log('subscribe load'); this.customers = x
    });
  }
}
