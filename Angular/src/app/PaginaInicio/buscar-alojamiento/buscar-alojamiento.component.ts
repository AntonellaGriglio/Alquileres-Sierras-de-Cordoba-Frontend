import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Alojamiento } from 'app/Interfaces/alojamiento';
import { ComplejosService } from 'app/Services/complejos.service';
import { EstadiasService } from 'app/Services/estadias.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-buscar-alojamiento',
  templateUrl: './buscar-alojamiento.component.html',
  styleUrls: ['./buscar-alojamiento.component.css']
})
export class BuscarAlojamientoComponent implements OnDestroy{
  
alojamientos:Alojamiento[]=[];
  formulario!: FormGroup;
idComplejo! : number;
private subscription = new Subscription();
constructor(private ngbDateParserFormatter: NgbDateParserFormatter,private router: ActivatedRoute,private route: Router,private service :ComplejosService,private estaServ: EstadiasService, private formBuilder : FormBuilder){
  this.formulario = this.formBuilder.group({

    fechaIngreso:[],
    fechaEgreso:[],

  });

}
ngOnDestroy(): void {
  this.subscription.unsubscribe;
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
    this.service.getAlojamientoXFecha(this.formulario.controls['fechaIngreso'].value,this.formulario.controls['fechaEgreso'].value).subscribe({
      next:(respuesta) => {
        this.alojamientos=respuesta.listaAlojamiento

      }
    })
  )
}
idAlojamiento(id:number,idcomplejo:number) {
  this.route.navigate(['listaImagenes/' + idcomplejo +'/'+id]);
  }
}
