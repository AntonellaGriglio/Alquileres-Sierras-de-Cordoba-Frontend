import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Alojamiento } from 'app/Interfaces/alojamiento';
import { ComplejosService } from 'app/Services/complejos.service';
import { Complejo } from 'app/Interfaces/complejo';

@Component({
  selector: 'app-listado-alojamientos',
  templateUrl: './listado-alojamientos.component.html',
  styleUrls: ['./listado-alojamientos.component.css']
})
export class ListadoAlojamientosComponent implements OnInit,OnDestroy{
idComplejo =0;
listaAlojamiento: Alojamiento[] = [];
linkFacebook!:string;
linkInstagram!:string;

private subscription = new Subscription();
ngOnDestroy(): void {
  this.subscription.unsubscribe;
}

  constructor(private route: Router, private complServ: ComplejosService, private router: ActivatedRoute){
    this.idComplejo = this.router.snapshot.params["id"]
  }
  ngOnInit(): void {
    this.cargarLista();
    this.cargarComplejo();
  }
  cargarLista() {
    this.subscription.add(
      this.complServ.getListaAlojamiento(this.idComplejo).subscribe({
        next:(respuesta: { listaAlojamiento: Alojamiento[]; })=>{
          console.log(respuesta)
          this.listaAlojamiento = respuesta.listaAlojamiento
          
        }
      })
    )
  }
  cargarComplejo() {
    this.subscription.add(
      this.complServ.getComplejo(this.idComplejo).subscribe({
        next: (complejo: Complejo) => {
          this.linkFacebook = complejo.linkFacebook,
          this.linkInstagram=complejo.linkInstagram
        }
      })
    )
  }
  idAlojamiento(id:number) {
    this.route.navigate(['listaImagenes/' + this.idComplejo +'/'+id]);
    }

}
