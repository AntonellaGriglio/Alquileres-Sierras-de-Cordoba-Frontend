import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Estadia } from 'app/Interfaces/estadia';
import { EstadiaLista } from 'app/Interfaces/estadiaLista';
import { Estado } from 'app/Interfaces/estado';
import { EstadiasService } from 'app/Services/estadias.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { PaginationInstance  } from 'ngx-pagination';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-estadia',
  templateUrl: './lista-estadia.component.html',
  styleUrls: ['./lista-estadia.component.css']
})
export class ListaEstadiaComponent implements OnInit,OnDestroy {
  paginationConfig: PaginationInstance = {
    itemsPerPage: 10, // Number of items to display per page
    currentPage: 1, // Current page number
    totalItems: 0,
    id:"h" // Total number of items
  };
  pagination: PaginationInstance = {
    itemsPerPage: 10, // Number of items to display per page
    currentPage: 1, // Current page number
    totalItems: 0,
    id:"a" // Total number of items
  };
  p: number = 1;
  listado: EstadiaLista[]=[];
  estadias!:EstadiaLista[];
  estados:Estado[]=[];
  idComplejo=0;
  idEstado!: number;
  estadia!:Estadia;
  estadoAutorizado=true;
  lst = true;

  private subscription = new Subscription();

 constructor(private estaServ:EstadiasService,private router: ActivatedRoute,
   private route : Router) {
    this.idComplejo = this.router.snapshot.params["id"]
    }

   
 ngOnDestroy(): void {
   this.subscription.unsubscribe();
 }


 ngOnInit(): void {
   this.cargarEstado();
   this.cargarEstadias();
 }
 cargarEstadias(): void {
  this.subscription.add(
    this.estaServ.getListaEstadia(this.idComplejo, this.p).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        this.estadias = respuesta.listaEstadia;
        this.paginationConfig.totalItems = this.estadias.length;
      },
    })
  );
}

onPageChange(event: number): void {
  if (event === -1) {
    this.paginationConfig.currentPage -= 1;
  } else {
    this.paginationConfig.currentPage = event;
  }
  this.cargarEstadias();
}
onPage(event: number): void {
  if (event === -1) {
    this.pagination.currentPage -= 1;
  } else {
    this.pagination.currentPage = event;
  }
  this.cargarEstadias();
}
  cargarEstado() {
    this.subscription.add(
      this.estaServ.getEstados().subscribe({
        next:(respuesta)=>{
          this.estados=respuesta.listaEstado
        },
        error:()=>("Error al cargar los estados")
      })
    )
    
  }
  lista(idEstado:number) {
    this.lst=false
    if (idEstado==6){
      this.estadoAutorizado=false
    }else{
      this.estadoAutorizado=true
    }
    this.subscription.add(
      this.estaServ.getListaEstadiaXEstado(idEstado,this.idComplejo).subscribe({
        next:(respuesta)=>{
          this.listado=respuesta.listaEstadia
        },
        error:()=>("Error al cargar la lista")
      })
    )

    }
    Eliminar(nroEstadia: number) {
      Swal.fire({
        title: 'Seguro que queres eliminar la estadia',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        denyButtonText: `No eliminar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
      this.subscription.add(
        this.estaServ.getEstadiaxId(nroEstadia).subscribe({
          next:(respuesta:Estadia)=>{
            this.estadia = respuesta;
            this.estadia.idEstado=6;
            this.estaServ.modificarEstadia(this.estadia).subscribe({
              next:()=>{
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Estadia eliminada',
                  showConfirmButton: false,
                  timer: 1500
                })
                  
              },
              error:()=>{
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Error al eliminar la estadia',
                })
              },
            })
          }
        })
        
      )}
      })}





  }


