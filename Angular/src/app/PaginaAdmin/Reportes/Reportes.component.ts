import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'app/Services/reportes.service';
import { ChartData, ChartOptions } from 'chart.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-Reportes',
  templateUrl: './Reportes.component.html',
  styleUrls: ['./Reportes.component.css']
})
export class ReportesComponent implements OnInit {
  public diasOcupadosTotales! :number;
  public diasOcupadosMes!:number;
  public diasOcupadoXmes!:number;
  public idComplejo:number = 1;
  public subscription = new Subscription();


  

  constructor(private reporteServ: ReportesService) { }

  ngOnInit(): void {
    this.cargarDiaHoy();
  }
  cargarDiaHoy(){

    
  
  }




}



