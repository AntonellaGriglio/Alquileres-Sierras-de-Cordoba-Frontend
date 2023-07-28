import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaEstadiaComponent } from './consulta-estadia.component';

describe('ConsultaEstadiaComponent', () => {
  let component: ConsultaEstadiaComponent;
  let fixture: ComponentFixture<ConsultaEstadiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaEstadiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaEstadiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
