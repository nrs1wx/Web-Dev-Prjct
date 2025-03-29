import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Order } from '../models';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.component.html',
  standalone: true,
  styleUrls: ['orders.component.css'],
  imports: [CommonModule, FormsModule]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loadError = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getMyOrders().subscribe({
      next: (data) => this.orders = data,
      error: () => this.loadError = true
    });
  }
}
