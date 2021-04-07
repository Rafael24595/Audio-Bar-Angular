import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioBarComponent } from './audio-bar.component';

describe('AudioBarComponent', () => {
  let component: AudioBarComponent;
  let fixture: ComponentFixture<AudioBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
