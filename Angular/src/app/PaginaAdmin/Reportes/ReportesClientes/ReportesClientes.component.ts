import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportesService } from 'app/Services/reportes.service';
import { ChartData, ChartOptions } from 'chart.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ReportesClientes',
  templateUrl: './ReportesClientes.component.html',
  styleUrls: ['./ReportesClientes.component.css']
})
export class ReportesClientesComponent implements OnInit, OnDestroy {

  public idComplejo: number = 1;
  public dataLabel: string[] = [];
  public dataData: number[] = [];
  public provincia!: ChartData<'pie'>;
  public optionsProv!: ChartOptions;
  public comp=false;
  private subscription = new Subscription();
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [
    { data: [11], label: 'Total de Personas' }
  ];
  public barChart: any[] = [
    { data: [], label: 'Total de Personas' }
  ];
  selectedYear!: number;

  constructor(private service: ReportesService) {}

  ngOnInit() {
    this.loadData().then(() => {
      this.initializeChart();
      this.getDataFromAPI().then(() => {
        this.updateBarChartData(); // Actualizar los datos del gráfico después de obtener los datos de la API
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  getTotal(): number {
    return this.provincia.datasets[0].data?.reduce((a, b) => a + b, 0) ?? 0;
  }

  initializeChart() {
    this.provincia = {
      labels: this.dataLabel,
      datasets: [
        {
          data: this.dataData
        }
      ]
    };
    this.optionsProv = {
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw as number;
              const percentage = ((value / this.getTotal()) * 100).toFixed(2);
              return `${percentage}%`;
            }
          }
        }
      }
    };
  }

  loadData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.subscription.add(
        this.service.getReporteProvincia(this.idComplejo).subscribe({
          next: (result) => {
            result.lista.forEach((item: any) => {
              this.dataLabel.push(item.provincia);
              this.dataData.push(item.cantPersonas);
            });
            resolve(); // Resuelve la promesa cuando los datos estén disponibles
          },
          error: (error) => {
            console.error(error);
            reject(error); // Rechaza la promesa en caso de error
          }
        })
      );
    });
  }
  
  getDataFromAPI(): Promise<void> {
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    return new Promise((resolve, reject) => {
      this.subscription.add(
        this.service.getCantidadPersonas(this.idComplejo, anioActual).subscribe({
          next: (data) => {
            // Recorre los datos obtenidos y asigna el total de personas en el mes correspondiente
            data.forEach((datum: { month: number; totalPersonas: any; }) => {
              const monthIndex = datum.month - 1; // Resta 1 al mes para ajustar el índice del array
              this.barChartData[0].data[monthIndex] = datum.totalPersonas;
            });
            this.barChartData[0].label = String(anioActual);
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

  updateBarChartData(): void {
    // Actualiza los datos del gráfico
    this.barChartData = [
      { data: this.barChartData[0].data, label: this.barChartData[0].label }
    ];
  }
  getData(year: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.subscription.add(
        this.service.getCantidadPersonas(this.idComplejo, year).subscribe({
          next: (data) => {
            // Recorre los datos obtenidos y asigna el total de personas en el mes correspondiente
            data.forEach((datum: { month: number; totalPersonas: any; }) => {
              const monthIndex = datum.month - 1; // Resta 1 al mes para ajustar el índice del array
              this.barChart[0].data[monthIndex] = datum.totalPersonas;
            });
            this.barChart[0].label = String(year);
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

  comparar(anio: string) {
    const year = parseInt(anio, 10);
    if (!isNaN(year)) {
      this.selectedYear = year;
      this.getData(year).then(() => {
        this.comp=true
        this.updateData(); // Actualizar los datos del gráfico después de obtener los datos de la API
      });
    } else {
      console.error('El año ingresado no es válido.');
    }
  }

  updateData(): void {
    // Actualiza los datos del gráfico
    this.barChartData = [
      { data: this.barChartData[0].data, label:this.barChartData[0].label },
      {data:this.barChart[0].data, label:this.barChart[0].label}
    ];
  }
}

