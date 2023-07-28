import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Usuario } from 'app/Interfaces/usuario';
import { UsuariosService } from 'app/Services/usuarios.service';
import { Complejo } from 'app/Interfaces/complejo';
import { ComplejosService } from 'app/Services/complejos.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  idUsuario:number ;
  complejo = {} as Complejo
  usuario = {}as Usuario;
  idComplejo=0;
  private subscription = new Subscription();
  
  
  constructor(private route: Router, private usuServ: UsuariosService,private complserv :ComplejosService, private router: ActivatedRoute){
    this.idUsuario = this.router.snapshot.params["id"]
  }
  ngOnInit(): void {
    this.cargarNombreUsuario();
    
  }
  cargarNombreUsuario() {
    this.subscription.add(
      this.usuServ.getUserId(this.idUsuario).subscribe({
        next:(respuesta: Usuario)=>{
          this.idComplejo=respuesta.idComplejo
          console.log(respuesta)
          this.usuario=respuesta;

         
        }
      })
    )

    
  }
  


}
