import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AudioImgComponent } from './audio.component';

describe('AudioComponent', () => {
  let component: AudioImgComponent;
  let fixture: ComponentFixture<AudioImgComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
