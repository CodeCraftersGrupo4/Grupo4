import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
})
export class CorrectoPage implements OnInit {
  public usuario:Usuario;
  constructor(
    private activeroute: ActivatedRoute 
  , private router: Router
  , private toastController: ToastController) { 

this.usuario = new Usuario('', '', '', '', '', '');

this.activeroute.queryParams.subscribe(params => { 
  const nav = this.router.getCurrentNavigation();
  if (nav) {
    if (nav.extras.state) {
      this.usuario = nav.extras.state['usuario'];
      return;
    }
  }
  this.router.navigate(['/login']);
});
}


  ngOnInit() {
  }

}
