import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SaveCustomerComponent } from './save-customer.component';


const routes: Routes = [
  {
    path: '',
    component: SaveCustomerComponent
  }
];

@NgModule({
  declarations: [SaveCustomerComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class SaveCustomerModule { }
