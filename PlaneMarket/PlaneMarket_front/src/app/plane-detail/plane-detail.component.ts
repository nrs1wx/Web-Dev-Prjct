import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterModule} from '@angular/router';
import { CommonModule } from "@angular/common";
import { Plane } from '../models';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-plane-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './plane-detail.component.html',
  styleUrls: ['./plane-detail.component.css']
})
export class PlaneDetailComponent implements OnInit {
  planeId: number | null = null;
  plane: Plane | null = null;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.planeId = id ? +id : null;
      if (this.planeId !== null) {
        this.api.getPlane(this.planeId).subscribe(data => this.plane = data);
      }
    });
  }


  orderPlane(): void {
    if (this.plane) {
      this.api.createOrderForUser(this.plane.id).subscribe({
        next: (order) => alert('Order successfully created!'),
        error: (err) => alert('Failed to create order.')
      });
    }
  }

}
