import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenologyComponent } from './phenology.component';

describe('PhenologyComponent', () => {
  let component: PhenologyComponent;
  let fixture: ComponentFixture<PhenologyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenologyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
