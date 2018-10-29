import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPasswordResetComponent } from './project-login.component';

describe('ProjectLoginComponent', () => {
  let component: ProjectPasswordResetComponent;
  let fixture: ComponentFixture<ProjectPasswordResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectPasswordResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
