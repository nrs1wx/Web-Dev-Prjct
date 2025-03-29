import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Manufacturer } from '../models';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-manufacturers',
  templateUrl: 'manufacturers.component.html',
  standalone: true,
  styleUrls: ['manufacturers.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ReactiveFormsModule, RouterLink],
})
export class ManufacturersComponent implements OnInit {
  manufacturers: Manufacturer[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getManufacturers().subscribe((data) => (this.manufacturers = data));
  }
}
