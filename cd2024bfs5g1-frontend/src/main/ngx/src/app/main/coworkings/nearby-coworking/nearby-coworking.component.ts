import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  DialogService,
  OComboComponent,
  ODateInputComponent,
  OFormComponent,
  OGridComponent,
  OntimizeService, OSnackBarConfig,
  OTextInputComponent,
  OTranslateService,
  SnackBarService,
  Subject
} from "ontimize-web-ngx";
import { OMapComponent } from "ontimize-web-ngx-map";
import { Coworking,ImapAddress,CustomMapService } from 'src/app/shared/services/custom-map.service';

@Component({
  selector: "app-nearby-coworking",
  templateUrl: "./nearby-coworking.component.html",
  styleUrls: ["./nearby-coworking.component.css"],
})
export class NearbyCoworkingComponent implements OnInit {
  @ViewChild("coworking_map") coworking_map: OMapComponent;
  @ViewChild("combo") combo: OComboComponent;
  @ViewChild("address") address: OTextInputComponent;

  protected service: OntimizeService;
  public mostrarDiv: boolean = false;
  private location$ = new Subject<{ latitude: number, longitude: number }>;
  private location = this.location$.asObservable();
  selectedCoworking: any = null;

  public mapPosition: ImapAddress = {
    lat: 40.416775,
    lon: -3.70379,
    address: "Calle de Alcalá, 50",
    city: "Madrid",
  };
  public coworkings: Coworking[] = [];
  leafletMap: any;
  protected validAddress: boolean;
  protected mapLat: number; //Latitud
  protected mapLon: number; //Longitud

  constructor(
    private router: Router,
    private translate: OTranslateService,
    protected injector: Injector,
    protected snackBarService: SnackBarService,
    protected dialogService: DialogService,
    private http: HttpClient,
    private mapService: CustomMapService
  ) {
    this.service = this.injector.get(OntimizeService);
  }

  ngOnInit(): void {
    this.configureService();

    // Usa un timeout para asegurarte de que el mapa esté listo
    setTimeout(() => {
      this.leafletMap = this.coworking_map.getMapService().getMap();
      if (this.leafletMap) {
        console.log("Mapa inicializado correctamente:", this.leafletMap);
        this.getUserGeolocation();
      } else {
        console.error("El mapa aún no está listo.");
      }
    }, 1000);

  }

  getImageSrc(base64Image: string): string {
    if (!base64Image) {
      return './assets/images/coworking-default.jpg';
    }
    const mimeType = base64Image.charAt(0) === '/' ? 'image/jpeg' : 'image/png';
    return `data:${mimeType};base64,${base64Image}`;
  }
  protected configureService() {
    const conf = this.service.getDefaultServiceConfiguration("coworkings");
    this.service.configureService(conf);
  }
  public showDiv(mostrar?: boolean) {
    this.mostrarDiv = mostrar ? true : false;
    return this.mostrarDiv;
  }

  // ---------------------- MAPA ----------------------
  onAddressBlur(): void {
    const selectedCityId = this.combo.getValue();
    const address = this.address.getValue();
    const cityObject = this.combo.dataArray.find(
      (city) => city.id_city === selectedCityId
    );
    const cityName = cityObject ? cityObject.city : null;

    // this.customMapservice();

    if (!cityName || !address) {
      this.snackBar(this.translate.get("INVALID_LOCATION"));
      return;
    }

    const addressComplete = address ? `${address}, ${cityName}` : cityName;

    this.getCoordinatesForCity(addressComplete).then((results) => {
      if (results) {
        let [lat, lon] = results.split(";");
        this.mapLat = +lat;
        this.mapLon = +lon;
        if (this.coworking_map && this.coworking_map.getMapService()) {
          if (this.leafletMap) {
            this.leafletMap.setView([+lat, +lon], 16);
          } else {
            console.error("El mapa no está inicializado.");
          }
        } else {
          console.error("El servicio del mapa no está disponible.");
        }
        this.validAddress = true;

        this.obtenerCoworkings();

        this.coworking_map.addMarker(
          "coworking_marker", // id
          lat, // latitude
          lon, // longitude
          { draggable: true }, // options
          this.translate.get("COWORKING_MARKER"), // popup
          false, // hidden
          true, // showInMenu
          this.translate.get("COWORKING_MARKER") // menuLabel
        );
        this.showDiv(true);
      } else {
        //Si se ingresa una direccion que la api no reconoce -> Reseteo de la vista a Madrid y zoom 6
        this.snackBar(this.translate.get("ADDRESS_NOT_FOUND"));
        this.leafletMap.setView([40.416775, -3.70379], 6);
        this.showDiv(false);
      }
    });
  }

  //Es async porque realiza una solicitud HTTP para obtener datos de una API externa. responde = await porque se espera a que la solicitud HTTP se complete y devuelva una respuesta.
  private async getCoordinatesForCity(
    location: string
  ): Promise<string | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&countrycodes=es&format=json`;
      const response = await this.http.get<any>(url).toPromise();
      console.log(response);
      if (response?.length > 0) {
        const { lat, lon } = response[response.length - 1];
        this.mapLat = +lat;
        this.mapLon = +lon;
        console.log(`${lat};${lon}`);
        return `${lat};${lon}`;
      }
    } catch (error) {
      this.snackBar(this.translate.get("API_ERROR") + error);
    }
    return null;
  }

  private snackBar(message: string): void {
    this.snackBarService.open(message, {
      milliseconds: 5000,
      icon: "error",
      iconPosition: "left",
    });
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

  public getUserGeolocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setLocation(position.coords.latitude, position.coords.longitude);
          this.mapLat = position.coords.latitude;
          this.mapLon = position.coords.longitude;
          if (this.leafletMap) {
            this.leafletMap.setView([this.mapLat, this.mapLon], 14);
            this.obtenerCoworkings();
            
    this.mapService.addMarkers(this.leafletMap, this.coworkings, (selectedCoworking) => {

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
}
