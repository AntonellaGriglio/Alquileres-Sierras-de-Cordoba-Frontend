import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Complejo } from 'app/Interfaces/complejo';
import { Localidad } from 'app/Interfaces/localidad';
import { Persona } from 'app/Interfaces/persona';
import { Provincia } from 'app/Interfaces/provincia';
import { ComplejosService } from 'app/Services/complejos.service';
import { EstadiasService } from 'app/Services/estadias.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-cliente',
  templateUrl: './modificar-cliente.component.html',
  styleUrls: ['./modificar-cliente.component.css']
})
export class ModificarClienteComponent implements OnInit , OnDestroy{

  persona!: Persona;
  provincias:Provincia[]=[];
  localidades:Localidad[]=[];
  idComplejo=0;
  idPersona:number=0;

  private subscription= new Subscription();
  constructor(private estaServ:EstadiasService,private service:ComplejosService,private router: ActivatedRoute,
    private route : Router){
      this.idComplejo = this.router.snapshot.params["idComplejo"];
      this.idPersona = this.router.snapshot.params["idPersona"];
  }
  
  ngOnInit(): void {
    this.cargarProvincia();
    this.cargarCliente();
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
  cargarCliente() {
    this.subscription.add(
      this.estaServ.getPersonaxId(this.idPersona).subscribe({
        next:(respuesta:Persona)=>{
          this.persona=respuesta
          console.log(respuesta)
          this.cargarLocalidades(respuesta.idProvincia)
          
          
        }
      })
    )
  }
  cargarProvincia(){
    this.subscription.add(
      this.service.getProvincia().subscribe({
        next:(respuesta )=>{
          console.log(respuesta)
          this.provincias = respuesta.provincias;
          console.log(this.provincias)
        }
        
      })
    )
  }
  cargarDescripcion() {
    this.subscription.add(
      this.service.getLocalidadesDescripcion(this.persona.idLocalidad).subscribe({
        next: (respuesta)=>{
          console.log(respuesta)
          this.persona.Descripcion=respuesta.localidades[0].nombre
      }
    })
    )
    this.subscription.add(
      this.service.getProvinciasDescripcion(this.persona.idProvincia).subscribe({
        next: (respuesta)=>{
          console.log(respuesta)
          this.persona.Descripcion2=respuesta.provincias[0].nombre
      }
    })
    )
    
  }

    editarCliente() {
      this.persona.idpersona=this.idPersona
      this.subscription.add(
        this.estaServ.modificarPersona(this.persona).subscribe({
          next:()=>{
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Cliente Modificado',
              showConfirmButton: false,
              timer: 1500
            })
            this.route.navigate(['/principal/' + this.idComplejo]);
            
          },
          error:()=>{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error al modificar el cliente',
            })
          }
        })
      )
    
    }




}
