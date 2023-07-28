import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Alojamiento } from 'app/Interfaces/alojamiento';
import { ComplejosService } from 'app/Services/complejos.service';
import { EstadiasService } from 'app/Services/estadias.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-BuscarDisponibilidad',
  templateUrl: './BuscarDisponibilidad.component.html',
  styleUrls: ['./BuscarDisponibilidad.component.css']
})
export class BuscarDisponibilidadComponent implements OnInit {

  ngOnInit() {
  }
  alojamientos:Alojamiento[]=[];
  formulario!: FormGroup;
idComplejo : number =1;
private subscription = new Subscription();
constructor(private ngbDateParserFormatter: NgbDateParserFormatter,private router: ActivatedRoute,private route: Router,private service :ComplejosService,private estaServ: EstadiasService, private formBuilder : FormBuilder){
  this.formulario = this.formBuilder.group({

    fechaIngreso:[],
    fechaEgreso:[],

  });

}
guardar() {
  const selectedDate: NgbDateStruct | null = this.formulario.get('fechaIngreso')?.value;
  if (selectedDate !== null) {
    const formattedDate: string = this.ngbDateParserFormatter.format(selectedDate);
    this.formulario.controls['fechaIngreso'].patchValue(formattedDate);
    
  }
  const selectedDate2: NgbDateStruct | null = this.formulario.get('fechaEgreso')?.value;
  if (selectedDate !== null) {
    const formattedDate: string = this.ngbDateParserFormatter.format(selectedDate2);
    this.formulario.controls['fechaEgreso'].patchValue(formattedDate);
  }
  this.subscription.add(
    this.service.getDisponibilidad(this.formulario.controls['fechaIngreso'].value,this.formulario.controls['fechaEgreso'].value,this.idComplejo).subscribe({
      next:(respuesta) => {
        this.alojamientos=respuesta.listaAlojamiento

      }
    })
  )
}
idAlojamiento(id:number) {
  this.route.navigate(['listaImagenes/' + this.idComplejo +'/'+id]);
  }

}
