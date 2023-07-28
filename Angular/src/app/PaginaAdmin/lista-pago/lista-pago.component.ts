import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListaPago } from 'app/Interfaces/pagoLista';
import { EstadiasService } from 'app/Services/estadias.service';
import { PaginationInstance } from 'ngx-pagination';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-pago',
  templateUrl: './lista-pago.component.html',
  styleUrls: ['./lista-pago.component.css']
})
export class ListaPagoComponent implements OnInit,OnDestroy {
  paginationConfig: PaginationInstance = {
    itemsPerPage: 10, // Number of items to display per page
    currentPage: 1, // Current page number
    totalItems: 0,
    id:"h" // Total number of items
  };
  listaPagos:ListaPago[]=[]
  idComplejo:number = 0
  private subscription = new Subscription();

  
  constructor(private estaServ:EstadiasService,private router: ActivatedRoute,
    private route : Router){
      this.idComplejo = this.router.snapshot.params["idComplejo"]
  }
  ngOnInit(): void {
    this.cargarLista();
  }
  onPageChange(event: number): void {
    if (event === -1) {
      this.paginationConfig.currentPage -= 1;
    } else {
      this.paginationConfig.currentPage = event;
    }
    this.cargarLista();
  }
  cargarLista() {
    this.subscription.add(
      this.estaServ.getPagos(this.idComplejo).subscribe({
        next:(respuesta)=>{
          console.log(respuesta)
          this.listaPagos=respuesta.listaPagos
        }
      })
    )
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
