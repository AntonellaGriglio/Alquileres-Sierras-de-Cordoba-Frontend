import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaPagoComponent } from './modifica-pago.component';

describe('ModificaPagoComponent', () => {
  let component: ModificaPagoComponent;
  let fixture: ComponentFixture<ModificaPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificaPagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificaPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
