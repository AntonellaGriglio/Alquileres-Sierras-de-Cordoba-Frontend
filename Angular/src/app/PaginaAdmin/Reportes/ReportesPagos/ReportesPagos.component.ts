import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'app/Services/reportes.service';
import { ChartData } from 'chart.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ReportesPagos',
  templateUrl: './ReportesPagos.component.html',
  styleUrls: ['./ReportesPagos.component.css']
})
export class ReportesPagosComponent implements OnInit {
  public recaudacionTotalAnio!:number;
  public selectAnio!:number;
  private subscription = new Subscription();
  private idComplejo: number = 1
  public recaudacionXalojamientoComparacion: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: ''
      }
    ]
  };
  public pagos: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label:''
      }
    ]
  };
  public recaudacionXalojamiento: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label:''
      }
    ]
  };
  
  constructor(private service:ReportesService) {
    
   }

  ngOnInit() {
    this.cargarRecaudacion();
    this.recaudacion().then(()=>{
      this.inicialRecaudacion();
    });
    this.formaDePago().then(() => {
      this.inicialPagos();
    });
  }
  formaDePago(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.subscription.add(
        this.service.getPagosXtipos(this.idComplejo).subscribe({
          next:(respuesta)=>{
            respuesta.lista.forEach((item:any) =>{
              this.pagos.labels?.push(item.formaPago);
              this.pagos.datasets[0].data?.push(item.totalPagos)
            })
            resolve();
          }
        })
      )
    });
  }

  inicialPagos(): void {
    this.pagos = {
      labels: this.pagos.labels,
      datasets: [
        { data: this.pagos.datasets[0].data }
      ]
    };
  }
  cargarRecaudacion() {
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const mes = fechaActual.getMonth()+1;
    this.subscription.add(
      this.service.getRecaudacionTotal(this.idComplejo,anioActual).subscribe({
        next:(respuesta)=>{
          this.recaudacionTotalAnio =respuesta.toLocaleString('es-AR')
        }
      })
    )}
    recaudacion(): Promise<void> { 
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
      return new Promise((resolve, reject) => {
        this.subscription.add(
          this.service.getRecaudacionXalojamiento(this.idComplejo,anioActual).subscribe({
            next:(respuesta)=>{
              respuesta.lista.forEach((item:any) =>{
                this.recaudacionXalojamiento.labels?.push(item.alojamiento);
                this.recaudacionXalojamiento.datasets[0].data?.push(item.importeTotal)
              })
              this.recaudacionXalojamiento.datasets[0].label = String(anioActual)
              resolve();
            }
          })
        )
      });
    }
    inicialRecaudacion(){
      this.recaudacionXalojamiento = {
        labels:this.recaudacionXalojamiento.labels,
        datasets:[
          {data:this.recaudacionXalojamiento.datasets[0].data,
          label: this.recaudacionXalojamiento.datasets[0].label}
        ]
      }
    }

    recaudacionComparacion(anio:number): Promise<void>{
      return new Promise((resolve, reject) => {
        this.subscription.add(
          this.service.getRecaudacionXalojamiento(this.idComplejo,this.selectAnio).subscribe({
            next:(respuesta)=>{
              respuesta.lista.forEach((item:any)=>{
                this.recaudacionXalojamientoComparacion.datasets[0].data?.push(item.importeTotal)
              })              
              this.recaudacionXalojamientoComparacion.datasets[0].label =String(this.selectAnio)
              resolve();
            }
          }),
          
        )
      });
    }
    inicialComparacion(){
      this.recaudacionXalojamiento = {
        labels:this.recaudacionXalojamiento.labels,
        datasets:[
          {data:this.recaudacionXalojamiento.datasets[0].data,
          label: this.recaudacionXalojamiento.datasets[0].label},
          {data:this.recaudacionXalojamientoComparacion.datasets[0].data,
          label: this.recaudacionXalojamientoComparacion.datasets[0].label}
        ]
      }
    }
  compararRecaudaciones(anio:number){
    this.recaudacionComparacion(this.selectAnio).then(() => {
      this.inicialComparacion();
    });
  }

}
