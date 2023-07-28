import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  apiUrl: string = "https://localhost:7028/api/";

  constructor(private http: HttpClient) { }

  postLogin(nombreUsu: string, pass: string): Observable<any> {
    const cmd = {
      "NombreUsuario": nombreUsu,
      "Contraseña": pass
    };
    const url = this.apiUrl + 'user/login';
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(cmd);

    return this.http.post(url, body, { 'headers': headers });
  }
  getUserId(id: number): Observable<any> {
    const url = this.apiUrl + `user/getById/${id}`;
    const headers = { 'content-type': 'application/json' }

    return this.http.get(url, { 'headers': headers });
  }
}
