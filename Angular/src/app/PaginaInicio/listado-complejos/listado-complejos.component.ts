import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Complejo } from 'app/Interfaces/complejo';
import { ComplejosService } from 'app/Services/complejos.service';

@Component({
  selector: 'app-listado-complejos',
  templateUrl: './listado-complejos.component.html',
  styleUrls: ['./listado-complejos.component.css']
})
export class ListadoComplejosComponent implements OnDestroy {

  listaComplejos: Complejo[] = [];
  private subscription = new Subscription();
  ngOnDestroy(): void {
    this.subscription.unsubscribe;
  }
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
      idComplejo(id:number) {
        this.route.navigate(['listaAlojamiento/' + id]);
        }


}
