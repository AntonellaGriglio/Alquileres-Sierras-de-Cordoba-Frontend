import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmailModel } from 'app/Interfaces/emailModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

constructor(private http: HttpClient) { }
postLogin(email:EmailModel): Observable<any> {

  const url = 'https://localhost:7028/Api/Email';
  const headers = { 'content-type': 'application/json' }
  const body = JSON.stringify(email);

  return this.http.post(url, body, { 'headers': headers });
}

getEnlaceMP(importe:number):Observable<any>{
  return this.http.get("https://localhost:7028/api/mercadopago/obtener-enlace?importe="+importe)
}

}
