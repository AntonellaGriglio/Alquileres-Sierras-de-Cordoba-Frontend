import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Fecha } from 'app/Interfaces/fecha';
import { EstadiasService } from 'app/Services/estadias.service';
import { ActivatedRoute } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Subscription } from 'rxjs';
import { ComplejosService } from 'app/Services/complejos.service';
import { Alojamiento } from 'app/Interfaces/alojamiento';

interface ApiResponse {
  listaFechas: Fecha[];
}

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  listaFechas!: Fecha[];
  listaAlojamiento!: Alojamiento[];
  idComplejo=0;
  idAlojamiento=0;
  expresion=false;
  private subscription = new Subscription();

  constructor(private estadiaService: EstadiasService, private router: ActivatedRoute,private complejoserv:ComplejosService) { 
    this.idComplejo = this.router.snapshot.params["id"]
  }

  ngOnInit(): void {
    this.fetchEvents();
    this.cargarAlojamiento()
  }
  cargarAlojamiento() {
    this.subscription.add(
      this.complejoserv.getListaAlojamiento(this.idComplejo).subscribe({
        next:(respuesta: { listaAlojamiento: Alojamiento[]; })=>{
          this.listaAlojamiento = respuesta.listaAlojamiento
        }
      })
    )
  }
  cargar(){
    this.fetchEventss();
    this.expresion=true
  }

  fetchEventss(): void {
    this.estadiaService.getFechasXalojamiento(this.idComplejo,this.idAlojamiento).subscribe((respuesta: ApiResponse) => {
      this.listaFechas = respuesta.listaFechas;

      // Procesa los datos de la API y configura el calendario
      const events = this.listaFechas.map(item => ({ 
        start: new Date(item.fechaIngreso), // Convertir a Date
        end: new Date(item.fechaEgreso), // Convertir a Date
      }));

      this.calendarOptions.events = events;
    });
  }

  fetchEvents(): void {
    this.estadiaService.getFechas(this.idComplejo).subscribe((respuesta: ApiResponse) => {
      this.listaFechas = respuesta.listaFechas;

      // Procesa los datos de la API y configura el calendario
      const events = this.listaFechas.map(item => ({
        title: item.descripcion, // Elimina los primeros 3 caracteres ('12a')
        start: new Date(item.fechaIngreso), // Convertir a Date
        end: new Date(item.fechaEgreso), 
        color: 'red'// Convertir a Date
      }));

      this.calendarOptions.events = events;
    });
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [timeGridPlugin, interactionPlugin,dayGridPlugin],
    displayEventTime: false,
    events: []
  };
}

