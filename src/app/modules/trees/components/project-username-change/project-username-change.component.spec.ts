import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectUsernameChangeComponent } from './project-username-change.component';

describe('ProjectUsernameChangeComponent', () => {
  let component: ProjectUsernameChangeComponent;
  let fixture: ComponentFixture<ProjectUsernameChangeComponent>;

  beforeEach(async(() => {
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
