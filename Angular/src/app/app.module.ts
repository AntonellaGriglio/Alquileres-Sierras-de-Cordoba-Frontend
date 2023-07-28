import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaginaComponent } from './PaginaInicio/pagina/pagina.component';
import { PaginaAlojamientoComponent } from './PaginaInicio/pagina-alojamiento/pagina-alojamiento.component';
import { LoginComponent } from './PaginaInicio/login/login.component';
import { PrincipalComponent } from './PaginaAdmin/principal/principal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UsuariosService } from './Services/usuarios.service';
import { NavInicioComponent } from './PaginaInicio/nav-inicio/nav-inicio.component';
import { NavAdminComponent } from './PaginaAdmin/nav-admin/nav-admin.component';
import { ListadoComplejosComponent } from './PaginaInicio/listado-complejos/listado-complejos.component';
import { BuscarAlojamientoComponent } from './PaginaInicio/buscar-alojamiento/buscar-alojamiento.component';
import { ListadoAlojamientosComponent } from './PaginaInicio/listado-alojamientos/listado-alojamientos.component';
import { NuevaEstadiaComponent } from './PaginaAdmin/nueva-estadia/nueva-estadia.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComplejoComponent } from './PaginaAdmin/complejo/complejo.component';
import { ConsultaEstadiaComponent } from './PaginaInicio/consulta-estadia/consulta-estadia.component';
import { ListaClientesComponent } from './PaginaAdmin/lista-clientes/lista-clientes.component';
import { ListaEstadiaComponent } from './PaginaAdmin/lista-estadia/lista-estadia.component';
import { DesayunoPipe } from './Pipes/desayuno.pipe';
import { ModificarEstadiaComponent } from './PaginaAdmin/modificar-estadia/modificar-estadia.component';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ModificarClienteComponent } from './PaginaAdmin/modificar-cliente/modificar-cliente.component';
import { NuevaDetalleEstadiaComponent } from './PaginaAdmin/nueva-detalle-estadia/nueva-detalle-estadia.component';
import { ListaPagoComponent } from './PaginaAdmin/lista-pago/lista-pago.component';
import { ModificaPagoComponent } from './PaginaAdmin/modifica-pago/modifica-pago.component';
import { CalendarioComponent } from './PaginaAdmin/calendario/calendario.component';
import { CalendarioAlojamientoComponent } from './PaginaInicio/calendarioAlojamiento/calendarioAlojamiento.component';
import { EstadiasMañanaComponent } from './PaginaAdmin/estadiasManiana/estadiasManiana.component';
import { ReportesService } from './Services/reportes.service';
import { NgChartsModule } from 'ng2-charts';
import { ReportesComponent } from './PaginaAdmin/Reportes/Reportes.component';
import { ReportesClientesComponent } from './PaginaAdmin/Reportes/ReportesClientes/ReportesClientes.component';
import { ReportesEstadiaComponent } from './PaginaAdmin/Reportes/ReportesEstadia/ReportesEstadia.component';
import { ReportesPagosComponent } from './PaginaAdmin/Reportes/ReportesPagos/ReportesPagos.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TerminosYCondicionesComponent } from './PaginaInicio/TerminosYCondiciones/TerminosYCondiciones.component';

import { FooterComponent } from './PaginaInicio/footer/footer.component';
import { BuscarDisponibilidadComponent } from './PaginaAdmin/BuscarDisponibilidad/BuscarDisponibilidad.component';




@NgModule({
  declarations: [
    AppComponent,
    PaginaComponent,
    PaginaAlojamientoComponent,
    LoginComponent,
    PrincipalComponent,
    NavInicioComponent,
    NavAdminComponent,
    ListadoComplejosComponent,
    BuscarAlojamientoComponent,
    ListadoAlojamientosComponent,
    NuevaEstadiaComponent,
    ComplejoComponent,
    CalendarioComponent,
    ConsultaEstadiaComponent,
    ListaClientesComponent,
    ListaEstadiaComponent,
    DesayunoPipe,
    ModificarEstadiaComponent,
    ModificarClienteComponent,
    NuevaDetalleEstadiaComponent,
    ListaPagoComponent,
    ModificaPagoComponent,
    EstadiasMañanaComponent,
    CalendarioAlojamientoComponent,
    ReportesComponent,
    ReportesClientesComponent,
    ReportesEstadiaComponent,
    ReportesPagosComponent,
    TerminosYCondicionesComponent,
    FooterComponent,
    BuscarDisponibilidadComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    AppRoutingModule,
    FullCalendarModule,
    NgChartsModule,
    NgxPaginationModule
    
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [UsuariosService,ReportesService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
