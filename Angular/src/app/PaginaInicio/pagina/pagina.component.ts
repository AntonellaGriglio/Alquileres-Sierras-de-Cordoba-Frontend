import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Complejo } from 'app/Interfaces/complejo';
import { ComplejosService } from 'app/Services/complejos.service';

@Component({
  selector: 'app-pagina',
  templateUrl: './pagina.component.html',
  styleUrls: ['./pagina.component.css']
})
export class PaginaComponent implements OnInit{
  listaComplejos: Complejo[] = [];
  private subscription = new Subscription();


constructor(private route: Router, private router: ActivatedRoute, private complServ: ComplejosService){
this.CargarLista();
  
}
  CargarLista() {
    this.subscription.add(
      this.complServ.getListaComplejo().subscribe({
        next: (respuesta) =>{
          this.listaComplejos=respuesta.listaComplejos;
          console.log(respuesta)
          console.log(this.listaComplejos)

        },
        error:(er)=> {
          console.log("Error",er)
        }
      })
    )
    
  }
  
  ngOnInit(): void {
  
  }
  idComplejo(id:number) {
    this.route.navigate(['listaAlojamiento/' + id]);
    }

}
