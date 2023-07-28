import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoComplejosComponent } from './listado-complejos.component';

describe('ListadoComplejosComponent', () => {
  let component: ListadoComplejosComponent;
  let fixture: ComponentFixture<ListadoComplejosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoComplejosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoComplejosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
