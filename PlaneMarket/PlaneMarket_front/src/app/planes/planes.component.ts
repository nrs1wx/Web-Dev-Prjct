import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Plane } from '../models';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-planes',
  templateUrl: 'planes.component.html',
  standalone: true,
  styleUrls: ['planes.component.css'],
  imports: [CommonModule, FormsModule, RouterLink]
})
export class PlanesComponent implements OnInit {
  planes: Plane[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getPlanes().subscribe((data) => (this.planes = data));
  }
}
