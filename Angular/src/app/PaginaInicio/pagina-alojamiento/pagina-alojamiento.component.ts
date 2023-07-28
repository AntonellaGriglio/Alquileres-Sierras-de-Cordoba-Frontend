import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ImagenesAlojamiento } from 'app/Interfaces/ImagenesAlojamiento';
import { ComplejosService } from 'app/Services/complejos.service';
import { Complejo } from 'app/Interfaces/complejo';

@Component({
  selector: 'app-pagina-alojamiento',
  templateUrl: './pagina-alojamiento.component.html',
  styleUrls: ['./pagina-alojamiento.component.css']
})
export class PaginaAlojamientoComponent implements OnInit {
  idAlojamiento: number;
listaImagenes: ImagenesAlojamiento[] = [];
linkFacebook!:string;
linkInstagram!:string;


private subscription = new Subscription();
  idComplejo: number;

  constructor(private complServ: ComplejosService, private router: ActivatedRoute){
    this.idAlojamiento = this.router.snapshot.params["idAlojamiento"]
    this.idComplejo = this.router.snapshot.params["idComplejo"]
  }
  ngOnInit(): void {
    this.cargarLista();
    this.cargarComplejo();
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
  cargarLista() {
    this.subscription.add(
      this.complServ.getListaImagenesAlo(this.idAlojamiento).subscribe({
        next:(respuesta: { listaImagenes: ImagenesAlojamiento[]; })=>{
          console.log(respuesta)
          this.listaImagenes = respuesta.listaImagenes
          
        }
      })
    )
  }

}
