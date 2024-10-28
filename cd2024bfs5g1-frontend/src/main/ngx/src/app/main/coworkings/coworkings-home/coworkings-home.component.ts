import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-coworkings-home',
  templateUrl: './coworkings-home.component.html',
  styleUrls: ['./coworkings-home.component.css']
})
export class CoworkingsHomeComponent implements OnInit{

  // Creamos constructor
  constructor(
    protected dialog: MatDialog,
    protected sanitizer: DomSanitizer
  ) {}

  // Creamos una variable para pasarle al html el número de columnas, por defecto 2
  public gridCols: number = 2;

  ngOnInit() {
    // Al cargar, obtendremos al ancho de pantalla, para posteriormente pasarselo como parámetro a la funcion setGridCols
    this.setGridCols(window.innerWidth);
  }

  // Función que cambiará el número de columnas a 1 si el ancho de ventana es menor de 1000
  setGridCols(width: number) {
    this.gridCols = width < 1000 ? 1 : 2;
  }

  // Listener para que cuando se cambie el tamaño de la ventana, llamar al evento y la funcion setGridCols
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.setGridCols((event.target as Window).innerWidth);
  }

  // Función para convertir la imagen desde la base de datos
  public getImageSrc(base64: any): any {
    console.log(base64);
    return base64 ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + base64) : './assets/images/coworking-default.jfif';
  }

}
