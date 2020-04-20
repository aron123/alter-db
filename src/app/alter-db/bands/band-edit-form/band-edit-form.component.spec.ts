import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandEditFormComponent } from './band-edit-form.component';

describe('BandEditFormComponent', () => {
  let component: BandEditFormComponent;
  let fixture: ComponentFixture<BandEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
