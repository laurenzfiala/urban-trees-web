import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsaComponent } from './csa.component';

describe('CsaComponent', () => {
  let component: CsaComponent;
  let fixture: ComponentFixture<CsaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
