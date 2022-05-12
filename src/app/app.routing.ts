import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './pages/customers/customers.component';
import { SaveCustomerComponent } from './pages/customers/save-customer/save-customer.component';
import { HomeComponent } from './pages/home/home.component';


const routes: Routes = [
  // {
  //   path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  // },
  // {
  //   path: 'customers',
  //   children: [
  //     { path: '', loadChildren: () => import('./pages/customers/customers.module').then(m => m.CustomersModule) },
  //     // {
  //     //   path: 'add',
  //     //   loadChildren: () => import('./pages/customers/save-customer/save-customer.module').then(m => m.SaveCustomerModule)
  //     // },
  //     // {
  //     //   path: 'edit/:id',
  //     //   loadChildren: () => import('./pages/customers/save-customer/save-customer.module').then(m => m.SaveCustomerModule)
  //     // },
  //   ]
  // },
  {
    path: '404', loadChildren: () => import('./pages/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'customers',
    component: CustomersComponent,
    children: [
      { path: 'add', component: SaveCustomerComponent },
      { path: 'edit/:id', component: SaveCustomerComponent }
    ]
  },
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: '**', redirectTo: '404', pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponent = [
  HomeComponent, CustomersComponent, SaveCustomerComponent
];


