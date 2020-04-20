import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterDBComponent } from './alter-db.component';

describe('AlterDBComponent', () => {
  let component: AlterDBComponent;
  let fixture: ComponentFixture<AlterDBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlterDBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterDBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
