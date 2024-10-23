import { Component } from '@angular/core';

@Component({
  selector: 'app-coworkings-home',
  templateUrl: './coworkings-home.component.html',
  styleUrls: ['./coworkings-home.component.scss']
})
export class CoworkingsHomeComponent {
  // Función que retorna una URL de imagen de prueba basada en el ID del coworking o una imagen fija
  getImageUrl(coworkingId: number): string {
    // Puedes usar cualquier URL de imagen para pruebas, aquí utilizo Lorem Picsum
    return `https://picsum.photos/seed/${coworkingId}/300/200`;
  }
}

