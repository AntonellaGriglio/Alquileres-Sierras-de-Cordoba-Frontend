import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './PaginaAdmin/principal/principal.component';
import { ListadoAlojamientosComponent } from './PaginaInicio/listado-alojamientos/listado-alojamientos.component';
import { ListadoComplejosComponent } from './PaginaInicio/listado-complejos/listado-complejos.component';
import { LoginComponent } from './PaginaInicio/login/login.component';
import { PaginaComponent } from './PaginaInicio/pagina/pagina.component';
import { PaginaAlojamientoComponent } from './PaginaInicio/pagina-alojamiento/pagina-alojamiento.component';
import { NuevaEstadiaComponent } from './PaginaAdmin/nueva-estadia/nueva-estadia.component';
import { ComplejoComponent } from './PaginaAdmin/complejo/complejo.component';
import { ListaClientesComponent } from './PaginaAdmin/lista-clientes/lista-clientes.component';
import { ListaEstadiaComponent } from './PaginaAdmin/lista-estadia/lista-estadia.component';
import { ModificarEstadiaComponent } from './PaginaAdmin/modificar-estadia/modificar-estadia.component';
import { ModificarClienteComponent } from './PaginaAdmin/modificar-cliente/modificar-cliente.component';
import { NuevaDetalleEstadiaComponent } from './PaginaAdmin/nueva-detalle-estadia/nueva-detalle-estadia.component';
import { ListaPagoComponent } from './PaginaAdmin/lista-pago/lista-pago.component';
import { ModificaPagoComponent } from './PaginaAdmin/modifica-pago/modifica-pago.component';
import { CalendarioComponent } from './PaginaAdmin/calendario/calendario.component';

import { EstadiasMañanaComponent } from './PaginaAdmin/estadiasManiana/estadiasManiana.component';
import { ReportesComponent } from './PaginaAdmin/Reportes/Reportes.component';
import { ReportesClientesComponent } from './PaginaAdmin/Reportes/ReportesClientes/ReportesClientes.component';
import { ReportesEstadiaComponent } from './PaginaAdmin/Reportes/ReportesEstadia/ReportesEstadia.component';
import { ReportesPagosComponent } from './PaginaAdmin/Reportes/ReportesPagos/ReportesPagos.component';
import { BuscarAlojamientoComponent } from './PaginaInicio/buscar-alojamiento/buscar-alojamiento.component';
import { TerminosYCondicionesComponent } from './PaginaInicio/TerminosYCondiciones/TerminosYCondiciones.component';
import { BuscarDisponibilidadComponent } from './PaginaAdmin/BuscarDisponibilidad/BuscarDisponibilidad.component';


const routes: Routes = [
  {path: 'principal/:id', component: PrincipalComponent},
  {path: 'nuevaEstadia/:id',component:NuevaEstadiaComponent},
  {path: 'listaEstadiaEstado/:id', component:ListaEstadiaComponent},
  {path: 'listadoClientes/:id',component:ListaClientesComponent},
  {path: 'login', component: LoginComponent},
  {path: 'pagina', component: PaginaComponent},
  {path: 'listadoComplejos', component: ListadoComplejosComponent},
  {path: 'listaImagenes/:idComplejo/:idAlojamiento', component: PaginaAlojamientoComponent},
  {path: 'listaAlojamiento/:id', component: ListadoAlojamientosComponent},
  {path:'modificarEstadia/:id', component:ModificarEstadiaComponent},
  {path: 'complejo/:id', component:ComplejoComponent},
  {path: 'modificarEstadia/:idComplejo/:NroEstadia', component:ModificarEstadiaComponent},
  {path:'modificarCliente/:idComplejo/:idPersona',component:ModificarClienteComponent},
  {path:'registrarPago/:idComplejo/:idPersona/:NroEstadia',component:NuevaDetalleEstadiaComponent},
  {path:'listaPagos/:idComplejo',component:ListaPagoComponent},
  {path:'modificaPago/:idComplejo/:idPago/:idPersona/:importe',component:ModificaPagoComponent},
  {path:'calendario/:id', component:CalendarioComponent},
  {path:'estadiaManiana/:id', component:EstadiasMañanaComponent},
  {path:'reportes/:id', component:ReportesComponent},
  {path:'reportesClientes/:id', component:ReportesClientesComponent},
  {path:'reportesEstadias/:id',component:ReportesEstadiaComponent},
  {path:'reportesPagos/:id',component:ReportesPagosComponent},
  {path:'buscarXfechas',component:BuscarAlojamientoComponent},
  {path:'terminosycondiciones',component:TerminosYCondicionesComponent},
  {path:'buscarDisponibilidad/:id',component:BuscarDisponibilidadComponent},
  { path: '', redirectTo: 'pagina', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
