import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Alojamiento } from 'app/Interfaces/alojamiento';
import { Estado } from 'app/Interfaces/estado';
import { Localidad } from 'app/Interfaces/localidad';
import { Provincia } from 'app/Interfaces/provincia';
import { Persona } from 'app/Interfaces/persona';
import { ComplejosService } from 'app/Services/complejos.service';
import { EstadiasService } from 'app/Services/estadias.service';
import { Subscription } from 'rxjs';
import { NgbDateStruct, NgbDateParserFormatter, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { EmailModel } from 'app/Interfaces/emailModel';
import { EmailService } from 'app/Services/Email.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-nueva-estadia',
  templateUrl: './nueva-estadia.component.html',
  styleUrls: ['./nueva-estadia.component.css']
})
export class NuevaEstadiaComponent implements OnInit , OnDestroy{
provincias: Provincia[] = [];
localidades: Localidad[]=[];
alojamientos:Alojamiento[]=[];
estados: Estado[]=[];
texto!: string;
listaPersona:Persona[]=[];
verificar=false;
idPersona=0;
enlaceMp:string="";
enlace30Mp:string="";
text:string="";
enla=false;
des=false;
enviar=false;
fechasBloqueadas!: { fechaIngreso: NgbDateStruct, fechaEgreso: NgbDateStruct }[];
idal=false;
parserFormatter: NgbDateParserFormatter;

persona = {} as Persona;
formularioPersona!: FormGroup;
formularioEstadia!: FormGroup;
idComplejo : number =0;
email!:EmailModel;
private subscription = new Subscription();
  enlaceWhatsapp!: string;

constructor(private ngbDateParserFormatter: NgbDateParserFormatter,private router: ActivatedRoute,private route: Router,private service :ComplejosService,private estaServ: EstadiasService, 
  private formBuilder : FormBuilder,private emailService:EmailService){
  this.formularioPersona = this.formBuilder.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.minLength(10)]],
    email: ['', [Validators.required, Validators.email]],
    idProvincia: ['', Validators.required],
    idLocalidad: ['', Validators.required],
    Descripcion:[''],
    Descripcion2:[''],
    idComplejo:['']
  });

  this.formularioEstadia = this.formBuilder.group({
    idAlojamiento: ['', Validators.required],
    fechaIngreso: ['', Validators.required],
    fechaEgreso: ['', Validators.required],
    cantPersonas: ['', Validators.required],
    idEstado:['',Validators.required],
    idpersona:[''],
    importeTotal:['',Validators.required],
    NroReserva:[''],
    importePendiente:[''],
    fecha:[''],
    desayuno:['',Validators.required]
  },{ validators: this.validarFechas }
  );
  this.idComplejo = this.router.snapshot.params["id"]
  this.fechasBloqueadas = [];
  this.parserFormatter = ngbDateParserFormatter;
}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

ngOnInit(): void {
  this.cargarProvincia();
  this.cargarEstados();
  this.cargarAlojamiento();
  this.cargarPersonas();
}
validarFechas(formGroup: FormGroup) {
  const fechaIngreso = formGroup.get('fechaIngreso')?.value;
  const fechaEgreso = formGroup.get('fechaEgreso')?.value;

  if (fechaIngreso && fechaEgreso && fechaEgreso < fechaIngreso) {
    formGroup.get('fechaEgreso')?.setErrors({ 'fechaInvalida': true });
  } else {
    formGroup.get('fechaEgreso')?.setErrors(null);
  }
}
  cargarPersonas() {
    this.subscription.add(
      this.estaServ.getListaPersonas(this.idComplejo).subscribe({
        next:(respuesta)=>{
          console.log(respuesta)
          this.listaPersona=respuesta.listaClientes
        }
      })
    )
  }
  cargarFechas() {
    const idAlojamiento = this.formularioEstadia.get('idAlojamiento')?.value;
    if (idAlojamiento) {
      this.estaServ.getFechasXalojamiento(this.idComplejo, idAlojamiento).subscribe(response => {
        this.idal=true;
        this.fechasBloqueadas = response.listaFechas.map((fecha: { fechaIngreso: string | number | Date; fechaEgreso: string | number | Date; }) => {
          return {
            fechaIngreso: this.ngbDateParserFormatter.parse(new Date(fecha.fechaIngreso).toISOString()),
            fechaEgreso: this.ngbDateParserFormatter.parse(new Date(fecha.fechaEgreso).toISOString()),
          };
        });
      });
    }
  }
  

  markDisabled = (date: NgbDate): boolean => {
    if (Array.isArray(this.fechasBloqueadas)) {
      const dateString = this.ngbDateParserFormatter.format(date);

      for (const fecha of this.fechasBloqueadas) {
        if (fecha.fechaIngreso && fecha.fechaEgreso) {
          const fechaIngresoStr = this.ngbDateParserFormatter.format(fecha.fechaIngreso);
          const fechaEgresoStr = this.ngbDateParserFormatter.format(fecha.fechaEgreso);
          if (dateString >= fechaIngresoStr && dateString <= fechaEgresoStr) {
            return true; // Date falls within a blocked range
          }
        }
      }
    }

    return false; // Date is not blocked
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
  cargarEstados() {
    this.subscription.add(
      this.estaServ.getEstados().subscribe({
        next:(respuesta)=>{
          console.log(respuesta)
          this.estados = respuesta.listaEstado
        }
      })
    )
  }
  cargarLocalidades(idProvincia?:any) {
    if(idProvincia !== ''){
    this.subscription.add(
          this.service.getLocalidades(idProvincia).subscribe({
            next:(respuesta)=> {
              console.log(respuesta)
              this.localidades=respuesta.localidades;
            }
          }))
        }
        else {
          this.localidades = [];
        }
  }
  
cargarProvincia(){
  this.subscription.add(
    this.service.getProvincia().subscribe({
      next:(respuesta )=>{
        console.log(respuesta)
        this.provincias = respuesta.provincias;
      }
    })
  )
}
toggleDesayuno() {
  const control = this.formularioEstadia.controls['desayuno'];
  if (control.value == 0) {
    control.setValue(1);
  } else {
    control.setValue(0);
  }
}
guardar() {
  if (this.formularioEstadia.invalid) {
    return;
  }
  this.formularioEstadia.controls['importePendiente'].patchValue(this.formularioEstadia.controls['importeTotal'].value)
  const selectedDate: NgbDateStruct | null = this.formularioEstadia.get('fechaIngreso')?.value;
  if (selectedDate !== null) {
    const formattedDate: string = this.ngbDateParserFormatter.format(selectedDate);
    this.formularioEstadia.controls['fechaIngreso'].patchValue(formattedDate);
  }

  const selectedDate2: NgbDateStruct | null = this.formularioEstadia.get('fechaEgreso')?.value;
  if (selectedDate2 !== null) {
    const formattedDate: string = this.ngbDateParserFormatter.format(selectedDate2);
    this.formularioEstadia.controls['fechaEgreso'].patchValue(formattedDate);
  }
  if (this.des == true && this.verificar == true) {
    this.formularioPersona.controls['idComplejo'].patchValue(this.idComplejo);
    this.subscription.add(
      this.estaServ.postPersona(this.formularioPersona.value).subscribe({
        next: (respuesta) => {
          this.formularioEstadia.controls['idpersona'].patchValue(respuesta.idpersona);
          this.estaServ.postEstadia(this.formularioEstadia.value).subscribe({
            next: (res) => {
              console.log("Estadia guardada");
              if (this.formularioEstadia.controls['idEstado'].value == 2) {
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
              if(this.formularioEstadia.controls['idEstado'].value == 3 || this.formularioEstadia.controls['idEstado'].value == 4 ){
              this.route.navigate(['/registrarPago/',this.idComplejo,respuesta.idpersona,res.id]);
              }
            },
            error: () => console.log("Error al guardar estadia")
          });
        },
        error: () => console.log("Error al cargar la persona")
      })
    );
  }

 else {
    if (this.verificar == false) {
      console.log(this.formularioEstadia.value);
      this.subscription.add(
        this.estaServ.postEstadia(this.formularioEstadia.value).subscribe({
          next: (res) => {
            if (this.formularioEstadia.controls['idEstado'].value == 2) {
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
            if(this.formularioEstadia.controls['idEstado'].value == 3 || this.formularioEstadia.controls['idEstado'].value == 4 ){
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Estadia Guardada',
                showConfirmButton: false,
                timer: 1500
              })
              this.route.navigate(['registrarPago/',this.idComplejo,this.formularioEstadia.controls['idpersona'].value,res.id]);
              }
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Estadia Guardada',
                showConfirmButton: false,
                timer: 1500
              })
          },
          error: () => alert("Error al cargar la estadia")
        })
      );
  }
}
}
enviarWhatsApp() 
  {
  const fechaIngreso = new Date(this.formularioEstadia.controls['fechaIngreso'].value);
  const fechaEgreso = new Date(this.formularioEstadia.controls['fechaEgreso'].value);
  const diferenciaFechas = fechaEgreso.getTime() - fechaIngreso.getTime() - 1;
  const cantidadDias = Math.round(diferenciaFechas / 86400000);
  if(this.verificar == true){
  const telefono = this.persona.telefono;
  const mensaje = `Hola `+ this.persona.nombre +`, `+ this.persona.apellido +` gracias por elegirnos. Les mando la información de la estadía:%0A%0A` +
    `Fecha de Ingreso:`+ this.formularioEstadia.controls['fechaIngreso'].value +`%0A` +
    `Fecha de Egreso: `+ this.formularioEstadia.controls['fechaEgreso'].value +`%0A` +
    `Cantidad de Personas:`+ this.formularioEstadia.controls['cantPersonas'].value +`%0A` +
    `Cantidad de Noches: `+ cantidadDias +`%0A` +
    `Importe por noche: $`+ (this.formularioEstadia.controls['importeTotal'].value/cantidadDias).toLocaleString('es-AR') +`%0A` +
    `Importe para hacer la reserva: $`+ (this.formularioEstadia.controls['importeTotal'].value*0.30).toLocaleString('es-AR') +`, (30% del Importe Total)%0A` +
    `Importe total: $`+ this.formularioEstadia.controls['importeTotal'].value.toLocaleString('es-AR') +`%0A%0A` +
    `Link de Mercado pago Estadia total: `+ this.enlaceMp +`%0A` +
    `Link de Mercado pago Reserva 30%: `+ this.enlace30Mp +``;
  
   this.enlaceWhatsapp = `https://wa.me/${telefono}?text=${mensaje}`;
   
   window.open(this.enlaceWhatsapp);
  
  }if(this.verificar==false){
    this.subscription.add(
      this.estaServ.getPersonaxId(this.formularioEstadia.controls['idpersona'].value).subscribe({
        next:(respuesta)=>{
          const telefono = respuesta.telefono;
          const mensaje = `Hola `+ respuesta.nombre +`, `+ respuesta.apellido +` gracias por elegirnos. Les mando la información de la estadía:%0A%0A` +
          `Fecha de Ingreso:`+ this.formularioEstadia.controls['fechaIngreso'].value +`%0A` +
          `Fecha de Egreso: `+  this.formularioEstadia.controls['fechaEgreso'].value +`%0A` +
          `Cantidad de Personas:`+ this.formularioEstadia.controls['cantPersonas'].value +`%0A` +
          `Cantidad de Noches: `+ cantidadDias +`%0A` +
          `Importe por noche: `+ (this.formularioEstadia.controls['importeTotal'].value/cantidadDias).toLocaleString('es-AR') +`%0A` +
          `Importe para hacer la reserva:`+  (this.formularioEstadia.controls['importeTotal'].value*0.30).toLocaleString('es-AR') +`, (30% del Importe Total)%0A` +
          `Importe total: `+  this.formularioEstadia.controls['importeTotal'].value.toLocaleString('es-AR') +`%0A%0A` +
          `Link de Mercado pago Estadia total: `+ this.enlaceMp +`%0A` +
          `Link de Mercado pago Reserva 30%: `+ this.enlace30Mp +``;
        
         this.enlaceWhatsapp = `https://wa.me/${telefono}?text=${mensaje}`;
         
          window.open(this.enlaceWhatsapp);

        }
      })
    )
  }

  }
  EnviarEmail() {
    const fechaIngreso = new Date(this.formularioEstadia.controls['fechaIngreso'].value);
    const fechaEgreso = new Date(this.formularioEstadia.controls['fechaEgreso'].value);
    const diferenciaFechas = fechaEgreso.getTime() - fechaIngreso.getTime() - 1;
    const cantidadDias = Math.round(diferenciaFechas / 86400000);
    if(this.verificar == true){
    this.email={} as EmailModel;
    this.email.remitente="antonellagriglio18@gmail.com"
    this.email.asunto ="Datos Estadia";
    this.email.destinatario = this.persona.email;
    this.email.contenido="Hola " + this.persona.nombre + ", " + this.persona.apellido + " gracias por elegirnos. Les mando la información de la estadía:<br>" +
    "Fecha de Ingreso: " + this.formularioEstadia.controls['fechaIngreso'].value + "<br>" +
    "Fecha de Egreso: " + this.formularioEstadia.controls['fechaEgreso'].value + "<br>" +
    "Cantidad de Personas: " + this.formularioEstadia.controls['cantPersonas'].value + "<br>" +
    "Cantidad de Noches: " + cantidadDias + "<br>" +
    "Importe por noche: $" + this.formularioEstadia.controls['importeTotal'].value / cantidadDias + "<br>" +
    "Importe para hacer la reserva: $" + this.formularioEstadia.controls['importeTotal'].value * 0.30 + ", (30% del Importe Total)<br>" +
    "Importe total: $" + this.formularioEstadia.controls['importeTotal'].value + "<br><br>"+
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
    if(this.verificar == false){
      this.subscription.add(
        this.estaServ.getPersonaxId(this.formularioEstadia.controls['idpersona'].value).subscribe({
          next:(respuesta)=>{
            console.log(respuesta)
            this.email={} as EmailModel;
            this.email.remitente="antonellagriglio18@gmail.com"
            this.email.asunto ="Datos Estadia";
            this.email.destinatario = respuesta.email       
            this.email.contenido = "Hola " + respuesta.nombre + ", " + respuesta.apellido + " gracias por elegirnos. Les mando la información de la estadía:<br>" +
                "Fecha de Ingreso: " + this.formularioEstadia.controls['fechaIngreso'].value + "<br>" +
                "Fecha de Egreso: " + this.formularioEstadia.controls['fechaEgreso'].value + "<br>" +
                "Cantidad de Personas: " + this.formularioEstadia.controls['cantPersonas'].value + "<br>" +
                "Cantidad de Noches: " + cantidadDias + "<br>" +
                "Importe por noche: $" + this.formularioEstadia.controls['importeTotal'].value / cantidadDias + "<br>" +
                "Importe para hacer la reserva: $" + this.formularioEstadia.controls['importeTotal'].value * 0.30 + ", (30% del Importe Total)<br>" +
                "Importe total: $" + this.formularioEstadia.controls['importeTotal'].value + "<br><br>"+
                "Link de Mercado pago Estadia total: "+ this.enlaceMp+"<br>"+
                "Link de Mercado pago Reserva 30%: "+ this.enlace30Mp;
                this.text = encodeURIComponent(this.email.contenido);

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

          }
        })
      )
    }
  }
  cargarEnlace() {
   const importe= this.formularioEstadia.controls['importeTotal'].value;
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
  cargarDescripcion() {
    this.subscription.add(
      this.service.getLocalidadesDescripcion(this.formularioPersona.controls['idLocalidad'].value).subscribe({
        next: (respuesta)=>{
          console.log(respuesta)
          this.persona.Descripcion=respuesta.localidades[0].nombre
      }
    })
    )
    this.subscription.add(
      this.service.getProvinciasDescripcion(this.formularioPersona.controls['idProvincia'].value).subscribe({
        next: (respuesta)=>{
          console.log(respuesta)
          this.persona.Descripcion2=respuesta.provincias[0].nombre
          this.des=true

      }
    })
    )
    
  }
}


