import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Persona } from 'app/Interfaces/persona';
import { EstadiasService } from 'app/Services/estadias.service';
import { PaginationInstance } from 'ngx-pagination';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.css']
})
export class ListaClientesComponent implements OnInit,OnDestroy {
  paginationConfig: PaginationInstance = {
    itemsPerPage: 10, // Number of items to display per page
    currentPage: 1, // Current page number
    totalItems: 0,
    id:"h" // Total number of items
  };
  listado: Persona[] = [];
  idComplejo=0;

  private subscription = new Subscription();

 constructor(private estaServ:EstadiasService,private router: ActivatedRoute,
   private route : Router) {
    this.idComplejo = this.router.snapshot.params["id"]
    }

   
 ngOnDestroy(): void {
   this.subscription.unsubscribe();
 }
 onPageChange(event: number): void {
  if (event === -1) {
    this.paginationConfig.currentPage -= 1;
  } else {
    this.paginationConfig.currentPage = event;
  }
  this.cargarListado();
}

 ngOnInit(): void {
   this.cargarListado();
 }
 


cargarListado() {
 this.subscription.add(
   this.estaServ.getListaPersonas(this.idComplejo).subscribe({
     next: (respuesta) => {
      this.listado  = respuesta.listaClientes
      console.log(respuesta)
           
       },
       error : () => {
        alert('Error al comunicarse con la API')
      },
    }))

 
}
modificarArticulo(id :string){
 this.route.navigate(['modificar/'+ id]);
}
}
