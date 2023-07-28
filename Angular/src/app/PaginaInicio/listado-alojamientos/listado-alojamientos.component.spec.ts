import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoAlojamientosComponent } from './listado-alojamientos.component';

describe('ListadoAlojamientosComponent', () => {
  let component: ListadoAlojamientosComponent;
  let fixture: ComponentFixture<ListadoAlojamientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoAlojamientosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoAlojamientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
