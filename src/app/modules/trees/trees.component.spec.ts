import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TreesComponent } from './trees.component';

describe('TreesComponent', () => {
  let component: TreesComponent;
  let fixture: ComponentFixture<TreesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TreesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
