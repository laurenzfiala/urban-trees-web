import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUploadComponent } from './c-upload.component';

describe('CUploadComponent', () => {
  let component: CUploadComponent;
  let fixture: ComponentFixture<CUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
