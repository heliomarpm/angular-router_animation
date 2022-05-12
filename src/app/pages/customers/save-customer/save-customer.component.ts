import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { PubSubService } from 'src/app/shared/services/pub-sub.service';

import { SlideInAnimation } from 'src/app/shared/animations';
import { Customer } from '../customer.interface';

@Component({
  selector: 'app-save-customer',
  templateUrl: './save-customer.component.html',
  styleUrls: ['./save-customer.component.scss'],
  // make slide in/out animation available to this component
  animations: [SlideInAnimation],

  // attach the slide in/out animation to the host (root) element of this component
  host: { '[@slideInAnimation]': '' }
})
export class SaveCustomerComponent implements OnInit {
  title: string | undefined;
  customer: Customer = {
    id: 0,
    name: '',
    lastName: ''
  }
  saving = false;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private customerService: CustomerService,
      private pubSubService: PubSubService
  ) { }

  ngOnInit() {
      this.title = 'Add customer';
      const costumerId = Number(this.route.snapshot.params['id']);
      if (costumerId) {
          this.title = 'Edit customer';
          this.customerService.getById(costumerId).subscribe(x => this.customer = x);
      }
  }

  saveRecord() {
      // save customer
      this.saving = true;
      const action = this.customer.id ? 'update' : 'create';
      this.customerService[action](this.customer)
          .subscribe(() => {
              this.saving = false;

              // redirect to customers view
              this.router.navigate(['customers']);

              // publish event so list component refreshes
              this.pubSubService.publish('customers-updated');
          });
  }
}
