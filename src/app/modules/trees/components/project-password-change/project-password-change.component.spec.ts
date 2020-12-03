import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectPasswordChangeComponent } from './project-password-change.component';

describe('ProjectPasswordChangeComponent', () => {
  let component: ProjectPasswordChangeComponent;
  let fixture: ComponentFixture<ProjectPasswordChangeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectPasswordChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPasswordChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
