import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaDetalleEstadiaComponent } from './nueva-detalle-estadia.component';

describe('NuevaDetalleEstadiaComponent', () => {
  let component: NuevaDetalleEstadiaComponent;
  let fixture: ComponentFixture<NuevaDetalleEstadiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevaDetalleEstadiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaDetalleEstadiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
