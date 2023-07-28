import { Component, Input, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Fecha } from 'app/Interfaces/fecha';
import { EstadiasService } from 'app/Services/estadias.service';
import { ActivatedRoute } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FechaAlojamiento } from 'app/Interfaces/fechaAljamiento';
interface ApiResponse {
  listaFechas: FechaAlojamiento[];
  
}

@Component({
  selector: 'app-calendarioAlojamiento',
  templateUrl: './calendarioAlojamiento.component.html',
  styleUrls: ['./calendarioAlojamiento.component.css']
})
export class CalendarioAlojamientoComponent implements OnInit {

  listaFechas!: FechaAlojamiento[];
  @Input() idComplejo!: number ;
  @Input() idAlojamiento!: number;

  constructor(private estadiaService: EstadiasService, private router: ActivatedRoute) { 
  }

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.estadiaService.getFechasXalojamiento(this.idComplejo,this.idAlojamiento).subscribe((respuesta: ApiResponse) => {
      this.listaFechas = respuesta.listaFechas;

      // Procesa los datos de la API y configura el calendario
      const events = this.listaFechas.map(item => ({
        start: new Date(item.fechaIngreso), // Convertir a Date
        end: new Date(item.fechaEgreso),
        color: '#ff9f89'// Convertir a Date
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
