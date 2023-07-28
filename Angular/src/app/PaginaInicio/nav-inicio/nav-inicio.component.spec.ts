import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavInicioComponent } from './nav-inicio.component';

describe('NavInicioComponent', () => {
  let component: NavInicioComponent;
  let fixture: ComponentFixture<NavInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavInicioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
