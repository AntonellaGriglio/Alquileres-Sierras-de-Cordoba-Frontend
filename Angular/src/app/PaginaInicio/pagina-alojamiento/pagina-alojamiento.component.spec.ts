import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaAlojamientoComponent } from './pagina-alojamiento.component';

describe('PaginaAlojamientoComponent', () => {
  let component: PaginaAlojamientoComponent;
  let fixture: ComponentFixture<PaginaAlojamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginaAlojamientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaAlojamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
