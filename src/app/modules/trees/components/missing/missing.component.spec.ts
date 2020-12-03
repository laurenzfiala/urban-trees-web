import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {MissingComponent} from './missing.component';

describe('HomeComponent', () => {
  let component: MissingComponent;
  let fixture: ComponentFixture<MissingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
