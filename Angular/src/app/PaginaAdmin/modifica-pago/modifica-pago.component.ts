import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DetalleEstadia } from 'app/Interfaces/detalleEstadia';
import { Estadia } from 'app/Interfaces/estadia';
import { FormaDePago } from 'app/Interfaces/formaPago';
import { Pago } from 'app/Interfaces/pago';
import { Persona } from 'app/Interfaces/persona';
import { TipoDePago } from 'app/Interfaces/tipoPago';
import { EstadiasService } from 'app/Services/estadias.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modifica-pago',
  templateUrl: './modifica-pago.component.html',
  styleUrls: ['./modifica-pago.component.css']
})
export class ModificaPagoComponent implements OnInit,OnDestroy {
   persona = {} as Persona;
   formasDePagos :FormaDePago [] =[];
   tiposPagos:TipoDePago[]=[];
   pago!:Pago;
   importe:number=0;



    idComplejo : number =0;
    idPago : number=0;
    idPersona:number=0;
    private subscription = new Subscription();

  constructor(private router: ActivatedRoute,private estaServ: EstadiasService, private formBuilder : FormBuilder){

    this.idComplejo = this.router.snapshot.params["idComplejo"]
    this.idPago = this.router.snapshot.params["idPago"]  
    this.idPersona = this.router.snapshot.params["idPersona"]
    this.importe = this.router.snapshot.params["importe"]

  }
  cargarPago() {

    this.subscription.add(
      this.estaServ.getPagosXId(this.idPago).subscribe({
        next:(respuesta)=>{
          console.log(respuesta)
          this.pago = respuesta;
        }
      })
    )
  }
  cargarCliente() {
    this.subscription.add(
      this.estaServ.getPersonaxId(this.idPersona).subscribe({
        next:(respuesta: Persona)=>{
          this.persona=respuesta

        }     
       })
    )
  }

  cargarFormasDePago() {
    this.subscription.add(
      this.estaServ.getFormasPago().subscribe({
        next:(respuesta)=>{
          this.formasDePagos = respuesta.listaFormaPago
          
        }
      })
    )
  }
  cargarTiposDePago() {
    this.subscription.add(
      this.estaServ.getTiposPago().subscribe({
        next:(respuesta)=>{
          this.tiposPagos = respuesta.listaTiposPago
        }
      })
    )
  }
  guardar(){
    this.pago.idPago=this.idPago;
      this.subscription.add(
        this.estaServ.modificarPago(this.pago).subscribe({
          next:()=>{
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Pago Modificado',
              showConfirmButton: false,
              timer: 1500
            })
          },
          error:()=>{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error al modificar el pago',
            })
          }
        })
      )
  }

    
  
  ngOnInit(): void {
       
    this.cargarTiposDePago();
    this.cargarFormasDePago();
    this.cargarCliente();
    this.cargarPago();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
