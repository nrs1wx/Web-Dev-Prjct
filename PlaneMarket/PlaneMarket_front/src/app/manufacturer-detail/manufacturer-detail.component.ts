import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Manufacturer } from '../models';

@Component({
  selector: 'app-manufacturer-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manufacturer-detail.component.html',
  styleUrls: ['./manufacturer-detail.component.css']
})
export class ManufacturerDetailComponent {
  manufacturerId: number | null = null;
  manufacturer: Manufacturer | null = null;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.manufacturerId = id ? +id : null;

      if (this.manufacturerId !== null) {
        this.api.getManufacturer(this.manufacturerId).subscribe(data => this.manufacturer = data);
      }
    });
  }
}
