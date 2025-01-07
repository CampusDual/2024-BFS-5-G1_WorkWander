import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OTranslateService } from 'ontimize-web-ngx';
import { OMapComponent } from "ontimize-web-ngx-map";
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})

export class CustomMapService {
  constructor(private http: HttpClient, private translate: OTranslateService,) { }
  protected mp: any; //Mapa

  public async getMap(mapa: OMapComponent, address: ImapAddress): Promise<[number, number]> {

    if (address[0].lat && address[0].lon) {
      this.addMark(mapa, address[0].lat, address[0].lon);
      console.log("Latitud: " + address[0].lat + " Longitud: " + address[0].lon);
    } else {
      const coordinates = await this.getCoordinates(address[0].city, address[0].address);
      if (!coordinates[0] || !coordinates[1]) {
        const [lat, lon] = coordinates[0].split(';').map(Number);
        this.addMark(mapa, lat, lon);
      }
      if (coordinates) {
        const [lat, lon] = coordinates.split(';').map(Number);
        this.addMark(mapa, lat, lon);
        return [lat, lon];
      }

    }
  }
  public async getCoordinates(city: string, street: string): Promise<string | null> {
    const encodedCity = encodeURIComponent(city);
    const encodedStreet = encodeURIComponent(street);
    const encodedCountry = encodeURIComponent("Spain");

    try {
      const url = `https://nominatim.openstreetmap.org/search?city=${encodedCity}&street=${encodedStreet}&country=${encodedCountry}&format=json&addressdetails=1`;
      const response = await this.http.get<any>(url).toPromise();
      if (response?.length > 0) {
        const { lat, lon } = response[response.length - 1]; //Obtiene la última posición de la respuesta que es la más precisa
        return `${lat};${lon}`;
      }
    } catch (error) {
      console.log("API_ERROR" + error);
    }
    return null;
  }

  private addMark(mapa: OMapComponent, lat: number, lon: number): void {
    this.mp = mapa.getMapService().getMap();
    if (!this.mp) {
      console.error('El mapa no está inicializado.');
      return
    }
    this.mp.setView([+lat, +lon], 16);
    mapa.addMarker('coworking_marker',           // id
      lat,                        // latitude
      lon,                        // longitude
      { draggable: true },          // options
      this.translate.get("COWORKING_MARKER"), // popup
      false,                        // hidden
      true,                         // showInMenu
      this.translate.get("COWORKING_MARKER")  // menuL);
    );
  }

  public updateMapAndMarker(mapa: OMapComponent, lat: number, lon: number, markerLabel: string | null, marker: L.marker | null, latToSave: number | null, lonToSave: number | null ){
    this.mp = mapa.getMapService().getMap();
    this.mp.setView([+lat, +lon], 16);
      // Eliminar el marcador actual si existe
    if (marker) {
      this.mp.removeLayer(marker);
    }
      // Crear y agregar el nuevo marcador
      marker = L.marker([lat, lon], {title: markerLabel, draggable: true }).addTo(this.mp);
      marker.options.id = 1; // Añadir la ID al marcador
      // Evento click del marcador
      marker.on('click', (event: any) => {
        let id = event.target.options.id;
        console.log('Marcador clickeado:', id);
        alert(`Has clickeado en el marcador: ${markerLabel}`);
      });
      // Evento dragend del marcador
      marker.on('dragend', (event) => {
        const { lat, lng } = event.target.getLatLng(); // Obtener latitud y longitud
        latToSave = lat;
        lonToSave = lng;
        console.log('Nueva posición: ' + lat + ' ' + lng);
      });
    }


    public addMarkers(
      mapa: L.Map,
      coworkings: Coworking[],
      onClick: (coworking: Coworking) => void
    ): void {
      coworkings.forEach((coworking) => {
        const marker = L.marker([coworking.lat, coworking.lon], {
          title: coworking.name,
          draggable: false,
        }).addTo(mapa);
    
        // Asignar la ID del coworking
        marker.options.id = coworking.id;
    
        // Evento click para este marcador
        marker.on('click', () => {
          // Llamar al callback con los datos del coworking
          onClick(coworking);
        });
      });
    }
    
}



export interface ImapAddress {
  lat: number;
  lon: number;
  address: string;
  city: string;
}

export interface Coworking {
  id: number;
  name: string;
  lat: number;
  lon: number;
}



