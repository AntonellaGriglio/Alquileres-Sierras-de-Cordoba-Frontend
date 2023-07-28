import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alojamiento } from '../Interfaces/alojamiento';
import { Provincia } from 'app/Interfaces/provincia';
import { Localidad } from 'app/Interfaces/localidad';

@Injectable({
  providedIn: 'root'
})
export class ComplejosService {
   apiUrl: string = "https://localhost:7028/api/";

  constructor(private http: HttpClient) {
    
   }

   getListaComplejo(): Observable<any> {
    const url = this.apiUrl + "Complejo/lista";

    return this.http.get(url);
  }
  getListaAlojamiento(id:number): Observable<any> {
    const url = this.apiUrl + `Alojamiento/lista/${id}`;

    return this.http.get<any>(url);
  }
  getListaImagenesAlo(id:number): Observable<any> {
    const url = this.apiUrl + `Alojamiento/lista/imagenes/${id}`;

    return this.http.get<any>(url);
  }
  getProvincia():Observable<any>{
    const url="https://apis.datos.gob.ar/georef/api/provincias?aplanar=true&exacto=true";
    return this.http.get<any>(url);
  }
  getLocalidades(provincia_id:number):Observable<any>{
    
    return this.http.get<any>("https://apis.datos.gob.ar/georef/api/localidades?provincia="+ provincia_id+"&aplanar=true&max=1500&exacto=true");
  }
  getComplejo(id:number):Observable<any>{
    return this.http.get<any>("https://localhost:7028/api/Complejo/getById/"+id)
  }
  getLocalidadesDescripcion(idLocalidad:number):Observable<any>{
    return this.http.get<any>("https://apis.datos.gob.ar/georef/api/localidades?id="+idLocalidad+"&aplanar=true&campos=estandar&exacto=true")
  }
  getProvinciasDescripcion(idProvincia:number):Observable<any>{
    return this.http.get<any>("https://apis.datos.gob.ar/georef/api/provincias?id="+idProvincia+"&aplanar=true&campos=estandar&exacto=true")
  }
  getAlojamientoXFecha(fechaIngreso:string,fechaEgreso:string):Observable<any>{
    return this.http.get<any>("https://localhost:7028/api/Alojamiento/lista/"+fechaIngreso+"/"+fechaEgreso)
  }
  getDisponibilidad(fechaIngreso:string,fechaEgreso:string,idComplejo:number):Observable<any>{
    return this.http.get<any>("https://localhost:7028/api/Alojamiento/lista/"+fechaIngreso+"/"+fechaEgreso+"/"+idComplejo)
  }

}
