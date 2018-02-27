import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DFinishComponent } from './d-finish.component';

describe('DFinishComponent', () => {
  let component: DFinishComponent;
  let fixture: ComponentFixture<DFinishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DFinishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
