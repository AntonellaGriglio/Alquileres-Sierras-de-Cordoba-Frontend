import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleEstadia } from 'app/Interfaces/detalleEstadia';
import { Estadia } from 'app/Interfaces/estadia';
import { Estado } from 'app/Interfaces/estado';
import { Fecha } from 'app/Interfaces/fecha';
import { Pago } from 'app/Interfaces/pago';
import { ListaPago } from 'app/Interfaces/pagoLista';
import { Persona } from 'app/Interfaces/persona';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadiasService {
  

  constructor(private http:HttpClient) { }

  postEstadia(estadia : Estadia): Observable<any> {
    if(estadia.desayuno == null){
      var desayuno=0          
    }else{desayuno=1};
    const comando = {
      "nroEstadia": 0,
      "idPersona": estadia.idpersona,
        "fecha": "2023-04-19T00:14:31.442Z",
        "idEstado":estadia.idEstado,
        "fechaIngreso":estadia.fechaIngreso,
        "fechaEgreso": estadia.fechaEgreso,
        "cantPersona": estadia.cantPersonas,   
        "desayuno":desayuno,
        "importeTotal": estadia.importeTotal,
        "idAlojamiento":estadia.idAlojamiento,
        "importePendiente":estadia.importePendiente
      
    };
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(comando);
    
    const url ="https://localhost:7028/Api/Estadia/CrearEstadia" ;

    return this.http.post(url,body,{'headers':headers});
  }
  postPersona(persona : Persona): Observable<any> {
    const comando = {
      "idPersona": 0,
       "nombre": persona.nombre,
       "apellido": persona.apellido,
  "telefono": persona.telefono,
  "email": persona.email,
  "idLocalidad": persona.idLocalidad,
  "descripcion": persona.Descripcion2,
  "idProvincia": persona.idProvincia,
  "descripcion2": persona.Descripcion,
  "idComplejo":persona.idComplejo,
      
    };
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(comando);
    
    const url ="https://localhost:7028/Api/Estadia/CrearPersona" ;

    return this.http.post(url,body,{'headers':headers});
  }
  
  getEstados():Observable<any>{

    const url="https://localhost:7028/api/Estadia/listaEstados";
    return this.http.get<any>(url);
  }
  getListaPersonas(idComplejo:number):Observable<any>{

    const url="https://localhost:7028/api/Estadia/GetTodosClientes/"+ idComplejo;
    return this.http.get<any>(url);
  }
  getListaEstadiaXEstado(idEstado:number, idComplejo:number):Observable<any>{

    const url="https://localhost:7028/api/Estadia/GetEstadiasXEstado/"+ idEstado+"/"+idComplejo;
    return this.http.get<any>(url);
  }
  getListaEstadia(idComplejo: number, pageNumber: number): Observable<any> {
    const url = 'https://localhost:7028/api/Estadia/GetEstadias';
    const params = new HttpParams().set('idComplejo', idComplejo.toString()).set('pageNumber', pageNumber.toString());
    return this.http.get<any>(url, { params });
  }
  getEstadiaxId(NroEstadia:number):Observable<Estadia>{
    return this.http.get<Estadia>("https://localhost:7028/Api/Estadia/EstadiaxId/"+NroEstadia)
  }
  modificarEstadia(estadia:Estadia):Observable<any>{
    if(estadia.desayuno == null){
      var desayuno=0          
    }else{desayuno=1};
    const comando = {
      "nroEstadia": estadia.nroEstadia,
      "idPersona": estadia.idpersona,
        "fecha": "2023-04-19T00:14:31.442Z",
        "idEstado":estadia.idEstado,
        "fechaIngreso":estadia.fechaIngreso,
        "fechaEgreso": estadia.fechaEgreso,
        "cantPersona": estadia.cantPersonas,   
        "desayuno":desayuno,
        "importeTotal": estadia.importeTotal,
        "idAlojamiento":estadia.idAlojamiento,
        "importePendiente":estadia.importePendiente
      
    };
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(comando);
    
    const url ="https://localhost:7028/Api/Estadia/ModificarEstadia" ;

    return this.http.put(url,body,{'headers':headers})
  }
  getPersonaxId(idPersona:number):Observable<Persona>{
    return this.http.get<Persona>("https://localhost:7028/Api/Estadia/PersonaxId/"+idPersona)
  }
  modificarPersona(persona:Persona):Observable<any>{
    const comando = {
      "idPersona": persona.idpersona,
      "nombre": persona.nombre,
      "apellido": persona.apellido,
      "email":persona.email,
      "telefono":persona.telefono,
      "idLocalidad":persona.idLocalidad,
      "descripcion": persona.Descripcion,
      "idProvincia": persona.idProvincia,   
      "descripcion2":persona.Descripcion2,
      
    };
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(comando);
    
    const url ="https://localhost:7028/Api/Estadia/ModificarPersona" ;

    return this.http.put(url,body,{'headers':headers})
  }

  getTiposPago():Observable<any>{

    const url="https://localhost:7028/api/DetalleEstadia/listaTipoPagos";
    return this.http.get<any>(url);
  }
  getFormasPago():Observable<any>{

    const url="https://localhost:7028/api/DetalleEstadia/listaFormasdePago";
    return this.http.get<any>(url);
  }
  postPago(pago : Pago): Observable<any> {
    const comando = {
      "idPago": 0,
      "importe":pago.importe,
      "idTipoPago": pago.idTipoPago,
      "idFormaPago":pago.idFormaPago,
    };
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(comando);
    
    const url ="https://localhost:7028/Api/DetalleEstadia/Registrar/Pago" ;

    return this.http.post(url,body,{'headers':headers});
  }
  postDetalleEstadia(det : DetalleEstadia): Observable<any> {
    const comando = {
      "idDetalleEstadia": det.idDetalleEstadia,
      "idEstadia": det.idEstadia,
      "idPago": det.idPago
      
    };
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(comando);
    
    const url ="https://localhost:7028/Api/DetalleEstadia/Registrar/DetalleEstadia" ;

    return this.http.post(url,body,{'headers':headers});
  }
  getPagos(idComplejo:number):Observable<any>{
    return this.http.get<any>("https://localhost:7028/api/DetalleEstadia/Pago/"+idComplejo)
  }
  modificarPago(pago : Pago): Observable<any> {
    const comando = {
      "idPago": pago.idPago,
      "importe":pago.importe,
      "idTipoPago": pago.idTipoPago,
      "idFormaPago":pago.idFormaPago,
    };
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(comando);
    
    const url ="https://localhost:7028/Api/DetalleEstadia/Modifiacar/Pago" ;

    return this.http.put(url,body,{'headers':headers});
  }
  getPagosXId(idPago:number):Observable<Pago>{
    return this.http.get<Pago>("https://localhost:7028/Api/DetalleEstadia/GetPagoXId/"+idPago)
  }
  getFechas(idComplejo:number):Observable<any>{
    return this.http.get<any>("https://localhost:7028/api/Estadia/GetFechas/"+idComplejo)
  }
  getFechasXalojamiento(idComplejo:number,idAlojamiento:number):Observable<any>{
    return this.http.get<any>("https://localhost:7028/api/Estadia/GetFechasXalojamiento/"+idAlojamiento+"/"+idComplejo)
  }


}
