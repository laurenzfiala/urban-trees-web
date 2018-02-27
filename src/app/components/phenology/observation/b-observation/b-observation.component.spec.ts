import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BObservationComponent } from './b-observation.component';

describe('BObservationComponent', () => {
  let component: BObservationComponent;
  let fixture: ComponentFixture<BObservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BObservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
