import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alojamiento } from 'app/Interfaces/alojamiento';
import { Estado } from 'app/Interfaces/estado';
import { EstadiasService } from 'app/Services/estadias.service';
import { Subscription } from 'rxjs';
import { ComplejosService } from 'app/Services/complejos.service';
import { Estadia } from 'app/Interfaces/estadia';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Persona } from 'app/Interfaces/persona';
import { EmailModel } from 'app/Interfaces/emailModel';
import { EmailService } from 'app/Services/Email.service';

@Component({
  selector: 'app-modificar-estadia',
  templateUrl: './modificar-estadia.component.html',
  styleUrls: ['./modificar-estadia.component.css'],
  providers: [DatePipe]
})
export class ModificarEstadiaComponent implements OnInit , OnDestroy{

  NroEstadia:number=0;
  idComplejo:number=0;
  estadia!: Estadia;
  enla=false;
des=false;
enviar=false;
  alojamientos:Alojamiento[]=[];
  estados: Estado[]=[];
  persona!:Persona;
  email!:EmailModel;
  enlaceMp:string="";
enlace30Mp:string="";
text:string="";
enlaceWhatsapp!: string;
texto!: string;
  mostrar=false;
  private subscription = new Subscription();
  ngbDateParserFormatter: any;
  cantidadDias = 0;


  constructor(private estaServ:EstadiasService,private emailService:EmailService,private service:ComplejosService,private router: ActivatedRoute,
    private route : Router){
      this.NroEstadia = this.router.snapshot.params["NroEstadia"];
      this.idComplejo = this.router.snapshot.params["idComplejo"];
      this.cargarAlojamiento();
      this.cargarEstado();
  }

  ngOnInit(): void {
    this.cargarEstadia();
  }
  cargarEstadia() {
    this.subscription.add(
      this.estaServ.getEstadiaxId(this.NroEstadia).subscribe({
        next:(respuesta:Estadia)=>{
          this.estadia=respuesta;
          console.log(respuesta)
          const diferenciaFechas = new Date(respuesta.fechaEgreso).getTime() - new Date(respuesta.fechaIngreso).getTime();
          this.cantidadDias = Math.round(diferenciaFechas / 86400000);
          this.estaServ.getPersonaxId(this.estadia.idpersona).subscribe({
            next:(respuesta)=>{
              this.persona=respuesta
            }
          })
        },
        error:()=>("Error al cargar la estadia")

      })
    )
  }
  guardar() {
    this.estadia.importePendiente=this.estadia.importeTotal
    this.subscription.add(
      this.estaServ.modificarEstadia(this.estadia).subscribe({
        next:()=>{
          if (this.estadia.idEstado == 2) {
            this.cargarEnlace();
            Swal.fire({
              title: 'Guardado',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Email',
              cancelButtonText: 'WhatsApp',
              cancelButtonColor: '#25D366',
              showDenyButton: true,

            }).then((result) => {
              if (result.isConfirmed) {
                // Acción para el botón "PDF"
                this.EnviarEmail();
               if (result.dismiss === Swal.DismissReason.cancel) {
                // Acción para el botón "WhatsApp"
                this.enviarWhatsApp();
              } 
              }})
          }
          if(this.estadia.idEstado == 3 || this.estadia.idEstado == 4 ){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Estadia Guardada',
              showConfirmButton: false,
              timer: 1500
            })
            this.route.navigate(['registrarPago/',this.idComplejo,this.estadia.idpersona,this.estadia.nroEstadia]);
            }
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Estadia Guardada',
              showConfirmButton: false,
              timer: 1500
            })
        },
        error:()=>{Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al modificar la estadia',
        })}
      })
    )
    }
  ngOnDestroy(): void {
    this.subscription.unsubscribe;
  }
  cargarAlojamiento() {
    this.subscription.add(
      this.service.getListaAlojamiento(this.idComplejo).subscribe({
        next:(respuesta)=>{
          this.alojamientos = respuesta.listaAlojamiento
        }
  
      })
    )
  }
  cambiarFechas(){
    this.mostrar=true;
  }
  calcularCantidadDias() {
    const diferenciaFechas = this.estadia.fechaEgreso.getTime() - this.estadia.fechaIngreso.getTime();
    this.cantidadDias = Math.round(diferenciaFechas / 86400000);
  }
  
   cargarEstado() {
    this.subscription.add(
      this.estaServ.getEstados().subscribe({
        next:(respuesta)=>{
          console.log(respuesta)
          this.estados = respuesta.listaEstado
        }
      })
    )
  
  }
  enviarWhatsApp() 
  {
  const fechaIngreso = new Date(this.estadia.fechaIngreso);
  const fechaEgreso = new Date(this.estadia.fechaEgreso);
  const diferenciaFechas = fechaEgreso.getTime() - fechaIngreso.getTime() - 1;
  const cantidadDias = Math.round(diferenciaFechas / 86400000);
  
  const telefono = this.persona.telefono;
  const mensaje = `Hola `+ this.persona.nombre +`, `+ this.persona.apellido +` gracias por elegirnos. Les mando la información de la estadía:%0A%0A` +
    `Fecha de Ingreso:`+ fechaIngreso +`%0A` +
    `Fecha de Egreso: `+ fechaEgreso+`%0A` +
    `Cantidad de Personas:`+ this.estadia.cantPersonas +`%0A` +
    `Cantidad de Noches: `+ cantidadDias +`%0A` +
    `Importe por noche: $`+ (this.estadia.importeTotal/cantidadDias).toLocaleString('es-AR') +`%0A` +
    `Importe para hacer la reserva: $`+ (this.estadia.importeTotal*0.30).toLocaleString('es-AR') +`, (30% del Importe Total)%0A` +
    `Importe total: $`+ this.estadia.importeTotal.toLocaleString('es-AR') +`%0A%0A` +
    `Link de Mercado pago Estadia total: `+ this.enlaceMp +`%0A` +
    `Link de Mercado pago Reserva 30%: `+ this.enlace30Mp +``;
  
   this.enlaceWhatsapp = `https://wa.me/${telefono}?text=${mensaje}`;
   
   window.open(this.enlaceWhatsapp);
  
  
      
    
  }
  EnviarEmail() {
    const fechaIngreso = new Date(this.estadia.fechaIngreso);
    const fechaEgreso = new Date(this.estadia.fechaEgreso);
    const diferenciaFechas = fechaEgreso.getTime() - fechaIngreso.getTime() - 1;
    const cantidadDias = Math.round(diferenciaFechas / 86400000);
   
    this.email={} as EmailModel;
    this.email.remitente="antonellagriglio18@gmail.com"
    this.email.asunto ="Datos Estadia";
    this.email.destinatario = this.persona.email;
    this.email.contenido="Hola " + this.persona.nombre + ", " + this.persona.apellido + " gracias por elegirnos. Les mando la información de la estadía:<br>" +
    "Fecha de Ingreso: " + fechaIngreso + "<br>" +
    "Fecha de Egreso: " + fechaEgreso + "<br>" +
    "Cantidad de Personas: " + this.estadia.cantPersonas + "<br>" +
    "Cantidad de Noches: " + cantidadDias + "<br>" +
    "Importe por noche: $" + this.estadia.importeTotal / cantidadDias + "<br>" +
    "Importe para hacer la reserva: $" + this.estadia.importeTotal * 0.30 + ", (30% del Importe Total)<br>" +
    "Importe total: $" + this.estadia.importeTotal + "<br><br>"+
    "Link de Mercado pago Estadia total: "+ this.enlaceMp+"<br>"+
    "Link de Mercado pago Reserva 30%: "+ this.enlace30Mp;
    this.text = encodeURIComponent(this.email.contenido);
    
    this.subscription.add(
      this.emailService.postLogin(this.email).subscribe({
        next:()=>{
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Enviado',
            showConfirmButton: false,
            timer: 1500
          })

      },
        error:()=>{
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Enviado',
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
    )}
    
    
  
  cargarEnlace() {
   const importe= this.estadia.importeTotal;
   const importe30 = importe*0.30;
    this.emailService.getEnlaceMP(importe).subscribe({
      next:(respuesta)=>{
         this.enlaceMp = respuesta.enlacePago
         this.enla=true
      }
    })
    this.emailService.getEnlaceMP(importe30).subscribe({
      next:(respuesta)=>{
         this.enlace30Mp = respuesta.enlacePago
         this.enla=true
         this.enviar=true
      }
    })
  }


}
 

