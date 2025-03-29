import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaneDetailComponent } from './plane-detail.component';

describe('PlaneDetailComponent', () => {
  let component: PlaneDetailComponent;
  let fixture: ComponentFixture<PlaneDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaneDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaneDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
