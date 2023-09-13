import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router'; // Permite navegar y pasar parámetros extra entre páginas
import { ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})

export class InicioPage implements OnInit {

  public usuario: Usuario;

 constructor(private router: Router,private toastController: ToastController) {
    this.usuario = new Usuario('', '', '', '', '', '')

    // this.usuario.setUsuario('atorres@duocuc.cl', '1234');

  }

  ngOnInit() {
  }
  public ingresar(): void {
    
    if (this.usuario) {
      
      const mensajeError = this.usuario.validarUsuario();
      if (mensajeError) {
        this.mostrarMensaje(mensajeError);
        return;
      }

      
      const usu: Usuario | undefined = this.usuario.buscarUsuarioValido(this.usuario.correo, this.usuario.password);
      
      if (usu) {
        const navigationExtras: NavigationExtras = {
          state: {
            usuario: usu
          }
        };
        this.mostrarMensaje(`¡Bienvenido(a) ${usu.nombre} ${usu.apellido}!`);
        this.router.navigate(['/ingreso'], navigationExtras); 
      }
    }
  }

  // async mostrarMensaje(message: string) {
  //   const alert = await this.alertController.create({
  //     header: 'Aviso del sistema',
  //     message: message, // Utiliza el mensaje pasado como argumento
  //     buttons: ['OK'],
  //   });
  
  //   await alert.present();
  // }

  async mostrarMensaje(mensaje: string, duracion?: number) {
    const toast = await this.toastController.create({
        message: mensaje,
        duration: duracion? duracion: 2000
      });
    toast.present();
  }
}
