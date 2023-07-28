import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarEstadiaComponent } from './modificar-estadia.component';

describe('ModificarEstadiaComponent', () => {
  let component: ModificarEstadiaComponent;
  let fixture: ComponentFixture<ModificarEstadiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarEstadiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarEstadiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
