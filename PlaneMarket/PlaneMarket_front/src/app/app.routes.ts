import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ManufacturersComponent } from './manufacturers/manufacturers.component';
import { PlanesComponent } from './planes/planes.component';
import { OrdersComponent } from './orders/orders.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PlaneDetailComponent} from "./plane-detail/plane-detail.component";
import {ManufacturerDetailComponent} from "./manufacturer-detail/manufacturer-detail.component";
import {RegisterComponent} from "./register/register.component";

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'manufacturers', component: ManufacturersComponent },
    { path: 'manufacturers/:id', component: ManufacturerDetailComponent },
    { path: 'planes', component: PlanesComponent },
    { path: 'planes/:id', component: PlaneDetailComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent }
];

export class AppRoutingModule {}
