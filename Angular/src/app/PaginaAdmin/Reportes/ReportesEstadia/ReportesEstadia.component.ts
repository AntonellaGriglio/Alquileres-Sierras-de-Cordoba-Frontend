import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportesService } from 'app/Services/reportes.service';
import { ChartData } from 'chart.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ReportesEstadia',
  templateUrl: './ReportesEstadia.component.html',
  styleUrls: ['./ReportesEstadia.component.css']
})
export class ReportesEstadiaComponent implements OnInit, OnDestroy {
  private idComplejo: number = 1;
  public selectAnio!: number;
  public selectMes!: number;
  private subscription = new Subscription();
  public diasOcupadosXestados: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: []
      }
    ]
  };
  public diasOcupadoXalojamiento: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: ''
      }
    ]
  };
  public diasOcupadoXalojamientoXmes: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: ''
      }
    ]
  };
  public diasOcupadoalojamiento: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: ''
      }
    ]
  };
  public diasOcupadoalojamientoXmes: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: ''
      }
    ]
  };

  constructor(private service: ReportesService) {}

  ngOnInit() {
    this.diasOcupadosAnio().then(() => {
      this.inicialAnio();
    });

    this.diasOcupadosMes().then(() => {
      this.inicialMes();
    });

    this.diasXestado().then(() => {
      this.inicialEstado();
    });
  }

  diasOcupadosAnio(): Promise<void> {
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    return new Promise((resolve, reject) => {
      this.subscription.add(
        this.service.getDiasOcupados(this.idComplejo, anioActual).subscribe({
          next: (data) => {
            data.lista.forEach((item: any) => {
              this.diasOcupadoXalojamiento.labels?.push(item.descripcion);
              this.diasOcupadoXalojamiento.datasets[0].data?.push(item.totalDiasOcupados);
            });
            this.diasOcupadoXalojamiento.datasets[0].label = String(anioActual);
            resolve();
          },
          error: (error) => {
            console.error(error);
            reject(error); // Rechaza la promesa en caso de error
          }
        })
      );
    });
  }

  inicialAnio(): void {
    this.diasOcupadoXalojamiento = {
      labels: this.diasOcupadoXalojamiento.labels,
      datasets: [
        { data: this.diasOcupadoXalojamiento.datasets[0].data ,
        label:this.diasOcupadoXalojamiento.datasets[0].label}
      ]
    };
  }

  diasOcupadosMes(): Promise<void> {
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1;
    return new Promise((resolve, reject) => {
      this.subscription.add(
        this.service.getDiasOcupadoXmes(this.idComplejo, anioActual, mes).subscribe({
          next: (data) => {
            data.lista.forEach((item: any) => {
              
              this.diasOcupadoXalojamientoXmes.labels?.push(item.descripcion);
              this.diasOcupadoXalojamientoXmes.datasets[0].data?.push(item.totalDiasOcupados);
            });
            this.diasOcupadoXalojamientoXmes.datasets[0].label = String(mes);
            resolve();
          },
          error: (error) => {
            console.error(error);
            reject(error); // Rechaza la promesa en caso de error
          }
        })
      );
    });
  }

  inicialMes(): void {
    this.diasOcupadoXalojamientoXmes = {
      labels: this.diasOcupadoXalojamiento.labels,
      datasets: [
        { data: this.diasOcupadoXalojamientoXmes.datasets[0].data,
        label:this.diasOcupadoXalojamientoXmes.datasets[0].label  }
      ]
    };
  }

  diasXestado(): Promise<void> {
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1;
    return new Promise((resolve, reject) => {
      this.subscription.add(
        this.service.getDiasOcupadosXestado(this.idComplejo, anioActual, mes).subscribe({
          next: (data) => {
            data.lista.forEach((item: any) => {
              this.diasOcupadosXestados.labels?.push(item.estado);
              this.diasOcupadosXestados.datasets[0].data?.push(item.diasOcupados);
            });
            resolve();
          },
          error: (error) => {
            console.error(error);
            reject(error); // Rechaza la promesa en caso de error
          }
        })
      );
    });
  }

  inicialEstado(): void {
    this.diasOcupadosXestados = {
      labels: this.diasOcupadosXestados.labels,
      datasets: [
        { data: this.diasOcupadosXestados.datasets[0].data }
      ]
    };
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAnio(anio: number): Promise<void> {
    this.selectAnio = anio;
    return new Promise((resolve, reject) => {
      this.subscription.add(
        this.service.getDiasOcupados(this.idComplejo, this.selectAnio).subscribe({
          next: (data) => {
            this.diasOcupadoalojamiento.labels = [];
            this.diasOcupadoalojamiento.datasets[0].data = [];
            data.lista.forEach((item: any) => {
              this.diasOcupadoalojamiento.datasets[0].data?.push(item.totalDiasOcupados);
            });
            this.diasOcupadoalojamiento.datasets[0].label = String(this.selectAnio);
            resolve();
          },
          error: (error) => {
            console.error(error);
            reject(error); // Rechaza la promesa en caso de error
          }
        })
      );
    });
  }

  updateAnio(): void {
    this.diasOcupadoXalojamiento={
      labels: this.diasOcupadoXalojamiento.labels,
   datasets: [
      { 
        data: this.diasOcupadoXalojamiento.datasets[0].data,
        label: this.diasOcupadoXalojamiento.datasets[0].label
      },
      { 
        data: this.diasOcupadoalojamiento.datasets[0].data,
        label: this.diasOcupadoalojamiento.datasets[0].label
      }
    ]
  }
  }

  compararAnio(anio: number) {
    if (!isNaN(anio)) {
      this.selectAnio = anio;
      this.getAnio(anio).then(() => {
        this.updateAnio(); // Actualizar los datos del gráfico después de obtener los datos de la API
      });
    } else {
      console.error('El año ingresado no es válido.');
    }
  }

  compararMes(mes: number) {
    if (!isNaN(mes)) {
      this.selectMes = mes;
      this.getMes(mes).then(() => {
        this.updateMes(); // Actualizar los datos del gráfico después de obtener los datos de la API
      });
    } else {
      console.error('El año ingresado no es válido.');
    }
  }
  getMes(mes: number): Promise<void> {
    
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    this.selectMes = mes;
    return new Promise((resolve, reject) => {
      this.subscription.add(
        this.service.getDiasOcupadoXmes(this.idComplejo, anioActual, mes).subscribe({
          next: (data) => {
            data.lista.forEach((item: any) => {
              this.diasOcupadoalojamientoXmes.datasets[0].data?.push(item.totalDiasOcupados);
            });
            this.diasOcupadoalojamientoXmes.datasets[0].label = String(mes);
            resolve();
          },
          error: (error) => {
            console.error(error);
            reject(error); // Rechaza la promesa en caso de error
          }
        })
      );
    });
  }

  updateMes(): void {
    this.diasOcupadoXalojamientoXmes={
      labels: this.diasOcupadoXalojamiento.labels,
   datasets: [
      { 
        data: this.diasOcupadoXalojamientoXmes.datasets[0].data,
        label: this.diasOcupadoXalojamientoXmes.datasets[0].label
      },
      { 
        data: this.diasOcupadoalojamientoXmes.datasets[0].data,
        label: this.diasOcupadoalojamientoXmes.datasets[0].label
      }
    ]
  }
  }
}
