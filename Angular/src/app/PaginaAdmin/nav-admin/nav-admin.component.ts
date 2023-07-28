import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Complejo } from 'app/Interfaces/complejo';
import { ComplejosService } from 'app/Services/complejos.service';
import { UsuariosService } from 'app/Services/usuarios.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-admin',
  templateUrl: './nav-admin.component.html',
  styleUrls: ['./nav-admin.component.css']
})
export class NavAdminComponent implements OnInit {
  @Input() idComplejo: number =0;
  @Input() idUsuario: number=0;
  complejo!: Complejo;
  private subscription = new Subscription();
  

  
  constructor(private route: Router, private usuServ: UsuariosService,private complserv :ComplejosService, private router: ActivatedRoute){
    
  }
  ngOnInit(): void {
    this.subscription.add(
      this.complserv.getComplejo(this.idComplejo).subscribe({
        next:(respuesta:Complejo)=>{
          this.complejo = respuesta;
        }
      })
    )
  }
}
