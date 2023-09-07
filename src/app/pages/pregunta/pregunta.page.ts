import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
})
export class PreguntaPage implements OnInit {

  public usuario: Usuario; 
  respuestaSecretaIngresada: string = '';

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

  public verificarRespuestaSecreta(): void {
    if(this.respuestaSecretaIngresada === ''){
      this.mostrarMensaje('Este campo no debe ir vacio')
    }else if(this.respuestaSecretaIngresada === this.usuario.respuestaSecreta){
      this.router.navigate(['/correcto'], { state: { usuario: this.usuario } });
    }else{
      this.router.navigate(['/incorrecto']);
    }
  }


  async mostrarMensaje(mensaje: string, duracion?: number) {
    const toast = await this.toastController.create({
        message: mensaje,
        duration: duracion? duracion: 2000
      });
    toast.present();
  }

}
