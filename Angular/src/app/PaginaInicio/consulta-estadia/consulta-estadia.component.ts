import { Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Alojamiento } from 'app/Interfaces/alojamiento';
import { Estado } from 'app/Interfaces/estado';
import { Localidad } from 'app/Interfaces/localidad';
import { Persona } from 'app/Interfaces/persona';
import { Provincia } from 'app/Interfaces/provincia';
import { ComplejosService } from 'app/Services/complejos.service';
import { EstadiasService } from 'app/Services/estadias.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { Complejo } from 'app/Interfaces/complejo';

@Component({
  selector: 'app-consulta-estadia',
  templateUrl: './consulta-estadia.component.html',
  styleUrls: ['./consulta-estadia.component.css']
})
export class ConsultaEstadiaComponent implements OnDestroy {
  ngOnDestroy(): void {
    this.subscription.unsubscribe;
  }

  idal=false;
  provincias: Provincia[] = [];
  localidades: Localidad[] = [];
  alojamientos: Alojamiento[] = [];
  estados: Estado[] = [];
  des = false;
  enlaceWhatsapp!: string;
  fechasBloqueadas!: { fechaIngreso: NgbDateStruct, fechaEgreso: NgbDateStruct }[];
  formularioEstadia!: FormGroup;
  complejo!: Complejo;
  formularioPersona: FormGroup;
  private subscription = new Subscription();
  parserFormatter: NgbDateParserFormatter;
  @Input() idComplejo!: number ;
  @Input() idAlojamiento!: number;

  constructor(
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private router: ActivatedRoute,
    private route: Router,
    private service: ComplejosService,
    private estaServ: EstadiasService,
    private formBuilder: FormBuilder
  ) {
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
      idEstado:[''],
      idpersona:[''],
      importeTotal:['']
    },{ validators: this.validarFechas }
    );

    this.idComplejo = this.router.snapshot.params["id"]

    this.cargarProvincia();
    this.fechasBloqueadas = [];
    this.parserFormatter = ngbDateParserFormatter;
  }



  ngOnInit(): void {
    this.cargarAlojamiento();
    this.cargarComplejo();
  }
  cargarComplejo(){
    this.subscription.add(
      this.service.getComplejo(this.idComplejo).subscribe({
        next:(respuesta)=>{
          this.complejo=respuesta
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

  validarFechas(formGroup: FormGroup) {
    const fechaIngreso = formGroup.get('fechaIngreso')?.value;
    const fechaEgreso = formGroup.get('fechaEgreso')?.value;

    if (fechaIngreso && fechaEgreso && fechaEgreso < fechaIngreso) {
      formGroup.get('fechaEgreso')?.setErrors({ 'fechaInvalida': true });
    } else {
      formGroup.get('fechaEgreso')?.setErrors(null);
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
  cargarLocalidades(idProvincia?:any) {
    if(idProvincia !== ''){
    this.subscription.add(
          this.service.getLocalidades(idProvincia).subscribe({
            next:(respuesta)=> {
              console.log(respuesta)
              this.localidades=respuesta.localidades;
            },
            error:()=> ("Error al obtener alojamientos")
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
      },
      error:()=>{
        alert('Error al cargar las categorias')
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
cargarDescripcion() {
  this.subscription.add(
    this.service.getLocalidadesDescripcion(this.formularioPersona.controls['idLocalidad'].value).subscribe({
      next: (respuesta)=>{
        console.log(respuesta)
        this.formularioPersona.controls['Descripcion'].patchValue=respuesta.localidades[0].nombre
    }
  })
  )
  this.subscription.add(
    this.service.getProvinciasDescripcion(this.formularioPersona.controls['idProvincia'].value).subscribe({
      next: (respuesta)=>{
        console.log(respuesta)
        this.formularioPersona.controls['Descripcion2'].patchValue=respuesta.provincias[0].nombre
        this.des=true
    }
  })
  )
  
}

//

guardar() {
  Swal.fire({
    html: '¿Aceptas los términos y condiciones? <br> <a href="terminosycondiciones" target="_blank" rel="noopener noreferrer">Terminos y Condiciones</a>',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {

    if (this.des == true) {
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

      this.formularioEstadia.controls['idEstado'].patchValue(1);
      this.formularioEstadia.controls['importeTotal'].patchValue(0); 
      this.formularioPersona.controls['idComplejo'].patchValue(this.idComplejo);
      this.subscription.add(
        this.estaServ.postPersona(this.formularioPersona.value).subscribe({
          next: (respuesta) => {
            this.formularioEstadia.controls['idpersona'].patchValue(respuesta.idpersona);
            this.estaServ.postEstadia(this.formularioEstadia.value).subscribe({
              next: () => {
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Estadia Guardada',
                  showConfirmButton: false,
                  timer: 1500
                })
                const mensaje = `Hola queria consultar disponibilidad  %0A%0A` +
                `Fecha de Ingreso:`+ this.formularioEstadia.controls['fechaIngreso'].value +`%0A` +
                `Fecha de Egreso: `+ this.formularioEstadia.controls['fechaEgreso'].value +`%0A` +
                `Cantidad de Personas:`+ this.formularioEstadia.controls['cantPersonas'].value +`%0A`

                this.enlaceWhatsapp = `https://wa.me/${this.complejo.telefono}?text=${mensaje}`;
         
                window.open(this.enlaceWhatsapp);

              },
              error: () => {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Error al cargar la estadia',
                  
                })
              }
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error al cargar la estadia',
              
            })
          }
        })
      );
    }
  } else {
    // El usuario no aceptó los términos y condiciones
    Swal.fire({
      html: 'Si no aceptas los terminos y condiciones no se puede realizar la consulta',
      icon: 'question',
      showCancelButton: true
    })
  }
  });
}


}
