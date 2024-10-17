import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEventsTableComponent } from './new-events-table.component';

describe('NewEventsTableComponent', () => {
  let component: NewEventsTableComponent;
  let fixture: ComponentFixture<NewEventsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEventsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEventsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
