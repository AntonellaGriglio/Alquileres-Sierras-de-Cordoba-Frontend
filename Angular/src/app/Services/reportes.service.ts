import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { aN } from '@fullcalendar/core/internal-common';
import { Observable } from 'rxjs';

@Injectable()
export class ReportesService {

constructor(private http: HttpClient) { }
getEstadiaManiana(idComplejo:number):Observable<any>{

    const url="https://localhost:7028/api/Reporte/GetEstadiasMañana/"+idComplejo;
    return this.http.get<any>(url);
  }
  getEstadia(nroEstadia:number):Observable<any>{
    const url = "https://localhost:7028/api/Reporte/GetEstadia/"+ nroEstadia;
    return this.http.get<any>(url)
  }
  getReporteProvincia(idComplejo:number):Observable<any>{
    const url ="https://localhost:7028/api/Reporte/CantPersonaXprovincia/"+idComplejo
    return this.http.get<any>(url)
  }
  getDiasOcupados(idComplejo:number,anio:number):Observable<any>{
    const url = "https://localhost:7028/api/Reporte/OcupacionAlojamientos/" +idComplejo +"/"+anio;
    return this.http.get<any>(url)
  }
  getDiasOcupadoXmes(idComplejo:number,anio:number,mes:number):Observable<any>{
    const url = "https://localhost:7028/api/Reporte/OcupacionAlojamientos/"+idComplejo +"/"+anio+"/"+mes;
    return this.http.get<any>(url)
  }
  getDiasOcupadosXestado(idComplejo:number,anio:number,mes:number):Observable<any>{
    const url ="https://localhost:7028/DiasOcupadosPorEstado/"+idComplejo +"/"+anio +"/"+mes;
    return this.http.get<any>(url)
    }
    getCantidadPersonas(idComplejo:number,anio:number):Observable<any>{
      const url= "https://localhost:7028/CantidadPersonasTotales/"+idComplejo +"/"+anio ;
      return this.http.get<any>(url)
    }

    getRecaudacionTotal(idComplejo:number,anio:number):Observable<any>{
      const url = "https://localhost:7028/RecaudacionTotal/"+idComplejo +"/"+anio;
      return this.http.get<any>(url)
    }
    getRecaudacionXalojamiento(idComplejo:number,anio:number):Observable<any>{
      const url = "https://localhost:7028/RecaudacionPorAlojamiento/" + anio +"/"+idComplejo;
      return this.http.get<any>(url)
    }
    getPagosXtipos(idComplejo:number):Observable<any>{
      const url ="https://localhost:7028/PagosPorTipo/"+idComplejo;
      return this.http.get<any>(url)
    }
}
