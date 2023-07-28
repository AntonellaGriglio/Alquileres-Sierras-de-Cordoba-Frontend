import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaEstadiaComponent } from './nueva-estadia.component';

describe('NuevaEstadiaComponent', () => {
  let component: NuevaEstadiaComponent;
  let fixture: ComponentFixture<NuevaEstadiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevaEstadiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaEstadiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
