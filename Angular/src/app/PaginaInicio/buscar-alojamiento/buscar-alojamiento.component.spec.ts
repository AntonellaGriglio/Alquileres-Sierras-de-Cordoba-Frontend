import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarAlojamientoComponent } from './buscar-alojamiento.component';

describe('BuscarAlojamientoComponent', () => {
  let component: BuscarAlojamientoComponent;
  let fixture: ComponentFixture<BuscarAlojamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarAlojamientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarAlojamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
