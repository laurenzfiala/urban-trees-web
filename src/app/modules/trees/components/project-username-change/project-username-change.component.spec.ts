import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectUsernameChangeComponent } from './project-username-change.component';

describe('ProjectUsernameChangeComponent', () => {
  let component: ProjectUsernameChangeComponent;
  let fixture: ComponentFixture<ProjectUsernameChangeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectUsernameChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectUsernameChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
