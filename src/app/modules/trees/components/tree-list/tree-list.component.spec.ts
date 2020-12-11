import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TreeListComponent } from './tree-list.component';

describe('TreeListComponent', () => {
  let component: TreeListComponent;
  let fixture: ComponentFixture<TreeListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
