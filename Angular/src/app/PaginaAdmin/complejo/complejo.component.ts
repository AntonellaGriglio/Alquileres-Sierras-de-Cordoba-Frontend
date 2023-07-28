import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Complejo } from 'app/Interfaces/complejo';
import { ComplejosService } from 'app/Services/complejos.service';
import { UsuariosService } from 'app/Services/usuarios.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-complejo',
  templateUrl: './complejo.component.html',
  styleUrls: ['./complejo.component.css']
})
export class ComplejoComponent implements OnInit {
  idComplejo:number;
  complejo!: Complejo;
  private subscription = new Subscription();
  

  
  constructor(private route: Router, private usuServ: UsuariosService,private complserv :ComplejosService, private router: ActivatedRoute){
    this.idComplejo = this.router.snapshot.params["id"]
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
