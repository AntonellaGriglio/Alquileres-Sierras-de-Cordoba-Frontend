import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailModel } from 'app/Interfaces/emailModel';
import { EstadiaManiana } from 'app/Interfaces/estadiaManiana';
import { EmailService } from 'app/Services/Email.service';
import { ReportesService } from 'app/Services/reportes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-estadiasManiana',
  templateUrl: './estadiasManiana.component.html',
  styleUrls: ['./estadiasManiana.component.css']
})
export class EstadiasMañanaComponent implements OnInit,OnDestroy {
  listado: EstadiaManiana[] = [];
  estadia:any;
  @Input() idComplejo: number =0;
  email!:EmailModel;

  private subscription = new Subscription();

 constructor(private service:ReportesService,private router: ActivatedRoute,
   private route : Router,private emailServ:EmailService) {
    this.idComplejo = this.router.snapshot.params["id"]
    }

   
 ngOnDestroy(): void {
   this.subscription.unsubscribe();
 }

 ngOnInit(): void {
   this.cargarListado();
 }
cargarListado() {
  this.subscription.add(
    this.service.getEstadiaManiana(1).subscribe({
      next:(respuesta)=>{
        this.listado = respuesta.listaEstadia;
      }
    })
  )
}
EnviarEmail() {
  this.email={} as EmailModel;
  this.email.remitente="antonellagriglio18@gmail.com"
  this.email.asunto ="Los esperamos";
  this.email.destinatario =this.estadia.email;
  this.email.contenido="Hola "+ this.estadia.nombre +"<br>"+
  "Los estamos esperando en el complejo "+ this.estadia.nombreComplejo +"<br>"+
  "¿Queriamos saber a que hora estaran llegando?";
  this.subscription.add(
    this.emailServ.postLogin(this.email).subscribe({
      next:()=>alert("Enviado")
    })
  )}
  
 
enviar(nroEstadia:number){
  this.subscription.add(
    this.service.getEstadia(nroEstadia).subscribe({
      next:(respuesta)=>{
        console.log(respuesta)
        this.estadia = respuesta;
        this.EnviarEmail();

      }
    })
  )
}
enviarWh(nroEstadia:number){
  this.subscription.add(
    this.service.getEstadia(nroEstadia).subscribe({
      next:(respuesta)=>{
        this.estadia = respuesta;
        this.EnviarWhatsApp();

      }
    })
  )
}
  EnviarWhatsApp() {
    const telefono = this.estadia.telefono;
    const mensaje = "Hola " +  this.estadia.nombre +`%0A`+
    "Los estamos esperando en el complejo " + this.estadia.nombreComplejo + `%0A`+
    "¿Queriamos saber a que hora estaran llegando?";
    const enlaceWhatsapp = `https://wa.me/${telefono}?text=${mensaje}`;
   
    window.open(enlaceWhatsapp);
   
  }
}