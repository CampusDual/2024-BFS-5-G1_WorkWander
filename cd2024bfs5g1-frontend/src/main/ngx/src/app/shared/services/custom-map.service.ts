import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { OntimizeService, OTranslateService, Subject } from 'ontimize-web-ngx';
import { OMapComponent } from "ontimize-web-ngx-map";

@Injectable({
  providedIn: 'root'
})

export class CustomMapService {
  constructor(private http: HttpClient, private translate: OTranslateService,) { }
  protected mp: any; //Mapa

  protected service: OntimizeService;
  public mostrarDiv: boolean = false;
  private location$ = new Subject<{ latitude: number, longitude: number }>;
  private location = this.location$.asObservable();
  selectedCoworking: any = null;

  protected mapLat: number; //Latitud
  protected mapLon: number; //Longitud

  public coworkings: Coworking[] = [];
  leafletMap: any;

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

  public updateMapAndMarker(mapa: OMapComponent, lat: number, lon: number, markerLabel: string | null, marker: L.marker | null, latToSave: number | null, lonToSave: number | null) {
    this.mp = mapa.getMapService().getMap();
    this.mp.setView([+lat, +lon], 16);
    // Eliminar el marcador actual si existe
    if (marker) {
      this.mp.removeLayer(marker);
    }
    // Crear y agregar el nuevo marcador
    marker = L.marker([lat, lon], { title: markerLabel, draggable: true }).addTo(this.mp);
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

  public setUserMap(mapaLocal: OMapComponent) {
    this.leafletMap = mapaLocal.getMapService().getMap();
  }

  public getUserGeolocation() {
    console.log("Obteniendo geolocalización del usuario...");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setLocation(position.coords.latitude, position.coords.longitude);
          this.mapLat = position.coords.latitude;
          this.mapLon = position.coords.longitude;

          console.log("Latitud: " + this.mapLat + " Longitud: " + this.mapLon);

          if (this.leafletMap) {
            this.leafletMap.setView([this.mapLat, this.mapLon], 14);
            this.obtenerCoworkings();

            this.addMarkers(this.leafletMap, this.coworkings, (selectedCoworking) => {

              const columns = [
                "cw_id",
                "cw_name",
                "cw_description",
                "cw_daily_price",
                "cw_image"
              ];

              this.service.query({ cw_id: selectedCoworking.id }, columns, "coworking").subscribe(
                (resp) => {
                  const coworkingData = resp.data;
                  if (coworkingData) {
                    this.selectedCoworking = coworkingData[0];
                    console.log(this.selectedCoworking);
                    this.mostrarDiv = true;
                  }
                },
                (error) => {
                  console.error("Error al consultar los detalles del coworking:", error);
                }
              );
            });
          }
        },
        (err) => {
          console.error(`Error: ${err.message}`);
        }
      );
    } else {
      console.error("Geolocalización no compatible en este navegador.");
    }
  }

  public setLocation(latitude: number, longitude: number) {
    this.location$.next({ latitude: latitude, longitude: longitude });
  }
  public getLocation() {
    let location = new Map<string, string>();
    location.set("Lat", this.mapLat.toString());
    location.set("Lan", this.mapLon.toString());
    return location;
  }

  public obtenerCoworkings() {
    const filter = {
      LAT_ORIGEN: this.mapLat,
      LON_ORIGEN: this.mapLon,
      DISTANCE: 5,
    };
    const columns = ["cw_id", "cw_name", "cw_lat", "cw_lon", "distancia_km"];

    const conf = this.service.getDefaultServiceConfiguration("coworkings");
    this.service.configureService(conf);

    this.service.query(filter, columns, "coworkingNearby").subscribe((resp) => {
      if (resp.code == 0) {
        console.log(resp.data);
        this.coworkings = resp.data.map(item => ({
          id: item.cw_id,
          name: item.cw_name,
          lat: +item.cw_lat,
          lon: +item.cw_lon,
          distance_km: item.distancia_km
        }));
        console.log(this.coworkings);
      }
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
  lat: number;
  lon: number;
  name: string;
  distance_km: number;
}



