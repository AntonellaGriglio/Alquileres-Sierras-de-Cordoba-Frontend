import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from 'app/Services/usuarios.service';
import { Usuario } from "app/Interfaces/usuario";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  usuario = {} as Usuario;

  constructor(private route:Router,private usuServ : UsuariosService){}

  ngOnInit(): void {
  
  }
  iniciarSesion() {
    this.usuServ.postLogin(this.usuario.NombreUsuario, this.usuario.Contrasenia).subscribe((data) => {
      if (data.ok) {
        console.log(data);
        this.route.navigate(['/principal/' + data.id]);
      } else {
        alert(data.error);
      }
    })
  }


}
