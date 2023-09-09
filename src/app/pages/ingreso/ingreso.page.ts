//import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import jsQR, { QRCode } from 'jsqr';
import { AnimationController} from '@ionic/angular';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
})
export class IngresoPage implements OnInit {

  @ViewChild('video')
  private video!: ElementRef;

  @ViewChild('canvas')
  private canvas!: ElementRef;

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;

  public escaneando = false;
  public datosQR: any = {};
  constructor(private animationController: AnimationController) { }

  ngOnInit() {
  }

  public ngAfterViewInit(): void {
    if (this.itemTitulo) {
      const animation = this.animationController
        .create()
        .addElement(this.itemTitulo.nativeElement)
        .iterations(Infinity)
        .duration(9000)
        .fromTo('transform', 'translate(0%)', 'translate(100%)')
        .fromTo('opacity', 0.8, 1);

      animation.play();
    }
  }

  public animateItem(elementRef: any) {
    this.animationController
      .create()
      .addElement(elementRef)
      .iterations(1)
      .duration(600)
      .fromTo('transform', 'translate(100%)', 'translate(0%)')
      .play();
  }

  public async comenzarEscaneoQR() {
    const mediaProvider: MediaProvider = await navigator.mediaDevices.getUserMedia({
      video: {facingMode: 'environment'}
    });
    this.video.nativeElement.srcObject = mediaProvider;
    this.video.nativeElement.setAttribute('playsinline', 'true');
    this.video.nativeElement.play();
    this.escaneando = true;
    requestAnimationFrame(this.verificarVideo.bind(this));
  }

  async verificarVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      if (this.obtenerDatosQR() || !this.escaneando) return;
      requestAnimationFrame(this.verificarVideo.bind(this));
    } else {
      requestAnimationFrame(this.verificarVideo.bind(this));
    }
  }

  // public obtenerDatosQR(): boolean {
  //   const w: number = this.video.nativeElement.videoWidth;
  //   const h: number = this.video.nativeElement.videoHeight;
  //   this.canvas.nativeElement.width = w;
  //   this.canvas.nativeElement.height = h;
  //   const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
  //   context.drawImage(this.video.nativeElement, 0, 0, w, h);
  //   const img: ImageData = context.getImageData(0, 0, w, h);
  //   let qrCode: QRCode | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
  //   if (qrCode) {
  //     if (qrCode.data !== '') {
  //       this.escaneando = false;
  //       this.mostrarDatosQROrdenados(qrCode.data);
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  public obtenerDatosQR(): boolean {
    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
    if (qrCode) {
      if (qrCode.data !== '') {
        this.escaneando = false;
        try {
          this.datosQR = JSON.parse(qrCode.data); // Parsea los datos del código QR como JSON
          this.mostrarDatosQROrdenados(this.datosQR);
          return true;
        } catch (error) {
          console.error('Error al analizar el JSON del código QR', error);
        }
      }
    }
    return false;
  }

  public mostrarDatosQROrdenados(datosQR: string): void {
    this.datosQR = datosQR;
    const objetoDatosQR = JSON.parse(datosQR);
    // ----------------------------------
    // TAREA PARA COMPLETAR POR EL ALUMNO
    // ----------------------------------
    // 1) Ejecutar el setter de la clase Asistencia:
    //     this.asistencia.setAsistencia(...parametros...)
    //    de modo que los parámetros los tome del objeto datosQR,
    //    por ejemplo: datosQR.nombreAsignatura contiene el valor 
    //    del nombre de la asignatura en la cual el alumno
    //    debe quedar presente.
    // 2) Hacer una interpolación entre las propiedades 
    //    de "this.asistencia" y la página HTML, de modo
    //    que la página muestre de manera ordenada estos datos.
  }

  public extraerValor(qrData: string, campo: string): string {
    const regex = new RegExp(`${campo}:\\s([^\\n]+)`);
    const matches = qrData.match(regex);
    if (matches && matches.length >= 2) {
      return matches[1];
    } else {
      return 'No encontrado'; // Puedes personalizar el mensaje si no se encuentra el campo
    }
  }

  // Si la propiedad this.escaneando cambia a false, entonces la función
  // "verificarVideo" deja de ejecutarse y se detiene el escaneo del QR.

  public detenerEscaneoQR(): void {
    this.escaneando = false;
  }


}
