import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEstadiaComponent } from './lista-estadia.component';

describe('ListaEstadiaComponent', () => {
  let component: ListaEstadiaComponent;
  let fixture: ComponentFixture<ListaEstadiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaEstadiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaEstadiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
