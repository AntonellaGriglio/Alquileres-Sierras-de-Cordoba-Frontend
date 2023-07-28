import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPagoComponent } from './lista-pago.component';

describe('ListaPagoComponent', () => {
  let component: ListaPagoComponent;
  let fixture: ComponentFixture<ListaPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaPagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
