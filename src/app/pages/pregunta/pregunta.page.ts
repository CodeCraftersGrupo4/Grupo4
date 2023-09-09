import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { AlertController } from '@ionic/angular';


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
      , private alertController: AlertController) { 

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


  async mostrarMensaje(message: string) {
    const alert = await this.alertController.create({
      header: 'Aviso del sistema',
      message: message, // Utiliza el mensaje pasado como argumento
      buttons: ['OK'],
    });
  
    await alert.present();
  }

}
