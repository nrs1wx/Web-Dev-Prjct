import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerDetailComponent } from './manufacturer-detail.component';

describe('ManufacturerDetailComponent', () => {
  let component: ManufacturerDetailComponent;
  let fixture: ComponentFixture<ManufacturerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufacturerDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManufacturerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
