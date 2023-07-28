import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Persona } from 'app/Interfaces/persona';
import { FormaDePago } from 'app/Interfaces/formaPago';
import { ComplejosService } from 'app/Services/complejos.service';
import { EstadiasService } from 'app/Services/estadias.service';
import { Subscription } from 'rxjs';
import { TipoDePago } from 'app/Interfaces/tipoPago';
import { DetalleEstadia } from 'app/Interfaces/detalleEstadia';
import { Pago } from 'app/Interfaces/pago';
import { Estadia } from 'app/Interfaces/estadia';
import { EmailModel } from 'app/Interfaces/emailModel';
import { EmailService } from 'app/Services/Email.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Recibo } from 'app/Interfaces/recibo';
import Swal from 'sweetalert2';

import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { br } from '@fullcalendar/core/internal-common';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


function generarPDF(recibo: Recibo): void {
  const documento: TDocumentDefinitions  = {
    content: [
      {
        text: 'Alquileres Sierras de Cordoba:',
        style: 'encabezado'
      },
      {
        layout: 'lightHorizontalLines',
        table: {
          widths: ['*', 300, '*'],
          body: [
            [{ text: 'Recibo', colSpan: 2, style: 'tableHeader' }, {}, { text: '$: ' + recibo.impote.toLocaleString('es-AR'), style: 'tableHeader' }],
            [{ text: 'Recibí de:', style: 'tableCell' }, recibo.cliente, ''],
            [{ text: 'La cantidad de:', style: 'tableCell' }, recibo.importeEnLetras +' pesos', ''],
            [{ text: 'Por concepto de:', style: 'tableCell' }, recibo.concepto, ''],
            [{ text: 'Pagado con :', style: 'tableCell' }, recibo.formaDePago, ''],
            ['', 'Fecha:', recibo.fecha],
            ['', 'Saldo pendiente:', { text: '$: ' + recibo.saldoPediente.toLocaleString('es-AR'), style: 'tableHeader' }]
          ]
        },
        
      },
      {
        text:'Complejo: '+ recibo.complejo,
        style: 'footer',
      },
      {
        text:recibo.texto
      }
    ],
    styles: {
      footer:{
        alignment:'right',
        fontSize: 12,
        bold: true,
        margin: [8, 25, 0,12]
      },
      encabezado: {
        alignment:'center',
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 50]
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: 'black'
      },
      tableCell: {
        fontSize: 12,
        color: 'black'
      }
    }
  };

  const pdfDocumento = pdfMake.createPdf(documento);
  pdfDocumento.download('recibo.pdf'); // Descargar el archivo PDF
}


function convertirNumeroEnLetras(numero: number): string {
  const unidades: string[] = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const especiales: string[] = ['', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
  const decenas: string[] = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const centenas: string[] = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

  if (numero === 0) {
    return 'cero';
  }

  if (numero < 0) {
    return 'menos ' + convertirNumeroEnLetras(Math.abs(numero));
  }

  let letras = '';

  if (numero >= 1000) {
    letras += convertirNumeroEnLetras(Math.floor(numero / 1000)) + ' mil ';
    numero %= 1000;
  }

  if (numero >= 100) {
    letras += centenas[Math.floor(numero / 100)] + ' ';
    numero %= 100;
  }

  if (numero >= 20) {
    letras += decenas[Math.floor(numero / 10)] + ' ';
    numero %= 10;
  }

  if (numero > 0 && numero < 10) {
    letras += unidades[numero] + ' ';
  }

  if (numero >= 10 && numero < 20) {
    letras += especiales[numero - 10] + ' ';
  }

  return letras.trim();
}
@Component({
  selector: 'app-nueva-detalle-estadia',
  templateUrl: './nueva-detalle-estadia.component.html',
  styleUrls: ['./nueva-detalle-estadia.component.css']
})

export class NuevaDetalleEstadiaComponent implements OnInit,OnDestroy{
   persona = {} as Persona;
   formasDePagos :FormaDePago [] =[];
   tiposPagos:TipoDePago[]=[];
   email!:EmailModel;
   complejo!:string;
   recibo={} as Recibo;
importePen!:number;

   formularioPago!: FormGroup;
    idComplejo : number =0;
    NroEstadia : number=0;
    idPersona:number=0;
    estadia!:Estadia;
    private subscription = new Subscription();

  constructor(private route:Router,private router: ActivatedRoute,
    private emailService:EmailService, private estaServ: EstadiasService, 
    private formBuilder : FormBuilder, private complejoServ: ComplejosService){
    this.formularioPago = this.formBuilder.group({
      idFormaPago:[],
      idTipoPago:[],
      importe:['',[Validators.required, this.validateNumber.bind(this)]],

    });
    this.idComplejo = this.router.snapshot.params["idComplejo"]
    this.NroEstadia = this.router.snapshot.params["NroEstadia"]  
    this.idPersona = this.router.snapshot.params["idPersona"]


  }
  cargarNombreComplejo(){
    this.subscription.add(
    this.complejoServ.getComplejo(this.idComplejo).subscribe({
      next:(respuesta)=>{
        console.log(respuesta)
        this.complejo = respuesta.nombreComplejo
      }
    }))
  }
  cargarEstadia() {

    this.subscription.add(
      this.estaServ.getEstadiaxId(this.NroEstadia).subscribe({
        next:(respuesta)=>{
          this.estadia = respuesta;
          this.importePen=respuesta.importePendiente;
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
          console.log(respuesta)
          this.tiposPagos = respuesta.listaTiposPago
        }
      })
    )
  }
  guardar() {
    const letras: string = convertirNumeroEnLetras(this.formularioPago.controls['importe'].value);
    console.log(letras);
    let detallesEstadia: DetalleEstadia = {
      idEstadia: 0,
      idPago: 0,
      idDetalleEstadia: 0
    };
    detallesEstadia.idEstadia = this.NroEstadia;
    
    if (this.formularioPago.valid === true) {
      this.subscription.add(
        this.estaServ.postPago(this.formularioPago.value).subscribe({
          next: (respuesta) => {
            console.log(respuesta);
            detallesEstadia.idPago = respuesta.idPago;
            console.log(detallesEstadia);
            this.subscription.add(
              this.estaServ.postDetalleEstadia(detallesEstadia).subscribe({
                next: () => {
                
                const importePendiente = this.estadia.importePendiente - this.formularioPago.controls['importe'].value;
                this.estadia.importePendiente = importePendiente
                if(this.formularioPago.controls['idTipoPago'].value == 1){
                  this.estadia.idEstado = 3
                }
                if(this.formularioPago.controls['idTipoPago'].value == 2){
                  this.estadia.idEstado = 4
                }
                  this.subscription.add(
                    this.estaServ.modificarEstadia(this.estadia).subscribe({
                      next: () => {
                        Swal.fire({
                          title: 'Guardado',
                          icon: 'success',
                          showCancelButton: true,
                          confirmButtonText: 'PDF',
                          cancelButtonText: 'WhatsApp',
                          cancelButtonColor: '#25D366',
                          showDenyButton: true,
                          denyButtonText:'Email',
                          denyButtonColor:'#25D366',

                        }).then((result) => {
                          if (result.isConfirmed) {
                            // Acción para el botón "PDF"
                            this.enviar(1);
                            Swal.fire({
                              title: 'PDF descargado',
                              icon: 'question',
                              showCancelButton: true,
                              confirmButtonText: 'WhatsApp',
                              confirmButtonColor:'#25D366',
                              showDenyButton: true,
                              denyButtonText:'Email',
                              denyButtonColor:'#25D366',
    
                            }).then((result) => {
                              if (result.isConfirmed) {
                                // Acción para el botón "PDF"
                                this.enviar(3);
                              }
                              else if (result.isDenied){
                                // Acción para el botón "Email"
                                this.enviar(2);
                              }
                            });

                          } else if (result.dismiss === Swal.DismissReason.cancel) {
                            // Acción para el botón "WhatsApp"
                            this.enviar(3);
                          } else if (result.isDenied){
                            // Acción para el botón "Email"
                            this.enviar(2);
                          }
                        });
                      },
                      error: (error) => {
                        console.error(error);
                      }
                    })
                  );
                },
                error: (error) => {
                  console.error(error);
                }
              })
            );
          },
          error: (error) => {
            console.error(error);
          }
        })
      );
    }
  }
  
    pdf(){
      generarPDF(this.recibo);
      this.route.navigate(['principal/',this.idComplejo])
    }
 
    enviar(id:number){
      if(this.formularioPago.controls['idTipoPago'].value == 1){
        this.recibo.concepto = 'Reserva';
      }
      if(this.formularioPago.controls['idTipoPago'].value == 2){
        this.recibo.concepto='Estadia'
      }
      if(this.formularioPago.controls['idFormaPago'].value == 1){
        this.recibo.formaDePago = 'Efectivo';
      }
      if(this.formularioPago.controls['idFormaPago'].value == 2){
        this.recibo.formaDePago='Mercado Pago'
      }
      if(this.formularioPago.controls['idFormaPago'].value == 3){
        this.recibo.formaDePago='Transferencia'
      }


      this.recibo.cliente=this.persona.nombre +" ," +this.persona.apellido
      const fec = new Date();
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const fechaIngreso = new Date(this.estadia.fechaIngreso);
      const fechaEgreso = new Date(this.estadia.fechaEgreso);
      const mesActual = meses[fec.getMonth()];
      const diaActual = fec.getDate();
      const anioActual = fec.getFullYear();
      const mesIngreso = fechaIngreso.getMonth()
      const mesEgrefo = fechaEgreso.getMonth()
      const diaIngreso = fechaIngreso.getDate()
      const diaEgrefo = fechaEgreso.getDate()
      const anioIngreso = fechaIngreso.getFullYear()
      const anioEgrefo = fechaEgreso.getFullYear()
      const Ingreso = `${diaIngreso} / ${mesIngreso}/ ${anioIngreso}`;
     const Egreso = `${diaEgrefo}/ ${mesEgrefo} /${anioEgrefo}`;

      
      
      this.recibo.fecha = `${diaActual} ${mesActual} ${anioActual}`;
      this.recibo.impote = this.formularioPago.controls['importe'].value.toLocaleString('es-AR'),
      this.recibo.importeEnLetras = convertirNumeroEnLetras(this.formularioPago.controls['importe'].value),
      this.recibo.saldoPediente = (this.estadia.importePendiente),
      this.recibo.complejo = this.complejo
      this.recibo.texto = "\nLa estadia comienza el dia "+Ingreso +" y se retiraran el dia " +Egreso +
      " para " + this.estadia.cantPersonas +" personas queda un saldo pendiente de $" + this.estadia.importePendiente.toLocaleString('es-AR') + "."+
      "\nLos esperamos que tengan buen viaje..." 
    

      if(id==1){
        this.pdf();
      }if(id==2){
        this.enviarMail()
      }if(id==3){
        this.enviarWha()
      }

    }
  enviarMail() {
    this.email={} as EmailModel;
    this.email.remitente="antonellagriglio18@gmail.com"
    this.email.asunto ="Registro de pago";
    this.email.destinatario = this.persona.email;
    this.email.contenido=this.persona.nombre+" ,"+ this.persona.apellido + " hemos recibido el dia " +
    this.recibo.fecha + " el importe de $" + this.recibo.impote.toLocaleString('es-AR') +
   " ,por medio de " + this.recibo.formaDePago + " por el concepto de " + this.recibo.concepto +
   " queda un saldo pendiente de $"+ this.recibo.saldoPediente.toLocaleString('es-AR');
    this.subscription.add(
      this.emailService.postLogin(this.email).subscribe({
        next:()=>{Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'enviado',
          showConfirmButton: false,
          timer: 1500
        }),
        this.route.navigate(['principal/',this.idComplejo])},
        error:()=>{
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Enviado',
            showConfirmButton: false,
            timer: 1500
          }),
          this.route.navigate(['principal/',this.idComplejo])
        }
      })
    )
  }
  enviarWha(){
    const telefono = this.persona.telefono;
    const mensaje =  this.persona.nombre+" ,"+ this.persona.apellido + " hemos recibido el dia " +
     this.recibo.fecha + " el importe de $" + this.recibo.impote.toLocaleString('es-AR') +
    " ,por medio de " + this.recibo.formaDePago + " por el concepto de " + this.recibo.concepto +
    " queda un saldo pendiente de $"+ this.recibo.saldoPediente.toLocaleString('es-AR');
    
     const enlaceWhatsapp = `https://wa.me/${telefono}?text=${mensaje}`;
     
     this.route.navigate(['principal/',this.idComplejo])
     window.open(enlaceWhatsapp);
  }
  
  ngOnInit(): void {
       
    this.cargarTiposDePago();
    this.cargarFormasDePago();
    this.cargarCliente();
    this.cargarEstadia();
    this.cargarNombreComplejo();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  validateNumber(control: FormControl) {
    const enteredValue = +control.value;
    if (enteredValue >= this.importePen) {
      return { 'invalidNumber': true };
    }
     return null;
  }
  onSubmit() {
    // Aquí puedes manejar la lógica cuando el formulario es enviado
    if (this.formularioPago.valid) {
      // Realizar acciones con el valor ingresado
      console.log('Número válido:', this.formularioPago.get('importe')!.value);
    }
  }

}
