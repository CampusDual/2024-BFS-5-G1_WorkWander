import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearbyCoworkingComponent } from './nearby-coworking.component';

describe('NearbyCoworkingComponent', () => {
  let component: NearbyCoworkingComponent;
  let fixture: ComponentFixture<NearbyCoworkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NearbyCoworkingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NearbyCoworkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
