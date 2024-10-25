import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEventsHomeComponent } from './my-events-home.component';

describe('MyEventsHomeComponent', () => {
  let component: MyEventsHomeComponent;
  let fixture: ComponentFixture<MyEventsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyEventsHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyEventsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
