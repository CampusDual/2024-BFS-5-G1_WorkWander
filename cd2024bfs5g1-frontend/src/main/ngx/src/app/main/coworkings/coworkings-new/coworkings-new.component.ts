import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  DialogService,
  OComboComponent,
  ODateInputComponent,
  OFormComponent,
  OntimizeService, OSnackBarConfig,
  OTextInputComponent,
  OTranslateService,
  SnackBarService,
} from "ontimize-web-ngx";
import { OMapComponent } from "ontimize-web-ngx-map";
import * as L from 'leaflet';
import { CustomMapService } from "src/app/shared/services/custom-map.service";

@Component({
  selector: "app-coworking-new",
  templateUrl: "./coworkings-new.component.html",
  styleUrls: ["./coworkings-new.component.css"],
})

export class CoworkingsNewComponent implements OnInit {
  public today: string = new Date().toLocaleDateString();
  public arrayServices: any = [];
  public exist = false;
  public availableServices: number = 6;
  public selectedServices: number = 0;
  protected service: OntimizeService;
  leafletMap: any;
  marker: L.marker = null;
  protected validAddress: boolean = false;
  protected mapLat: string = ""; //Latitud
  protected mapLon: string = ""; //Longitud
  protected coords = this.mapLat + ";" + this.mapLon; //Coordenadas a guardar en la DB a futuro

  @ViewChild("coworkingForm") coworkingForm: OFormComponent;
  @ViewChild("startDate") coworkingStartDate: ODateInputComponent;
  @ViewChild("endDate") coworkingEndDate: ODateInputComponent;
  @ViewChild("coworking_map") coworking_map: OMapComponent;
  @ViewChild('combo') combo: OComboComponent;
  @ViewChild('address') address: OTextInputComponent;

  constructor(
    private router: Router,
    private translate: OTranslateService,
    protected injector: Injector,
    protected snackBarService: SnackBarService,
    private mapService: CustomMapService,
    protected dialogService: DialogService,
    private http: HttpClient
  ) {
    this.service = this.injector.get(OntimizeService);
  }

  ngOnInit(): void {
    this.configureService();

    // Usa un timeout para asegurarte de que el mapa esté listo
    setTimeout(() => {
      this.leafletMap = this.coworking_map.getMapService().getMap();
      if (this.leafletMap) {
        console.log('Mapa inicializado correctamente:', this.leafletMap);
      } else {
        console.error('El mapa aún no está listo.');
      }
    }, 500);
  }

  protected configureService() {
    const conf = this.service.getDefaultServiceConfiguration('coworkings');
    this.service.configureService(conf);
  }

  public onInsertSuccess(): void {
    this.coworkingForm.setInitialMode();
    this.router.navigateByUrl("/main/mycoworkings")
  }

  public selectService(id: number, serv: string): void {
    this.exist = false;
    for (let i = 0; i < this.arrayServices.length; i++) {
      if (this.arrayServices[i].id === id) {
        this.exist = true;
        this.deleteService(i, id, serv);
      }
    }
    if (!this.exist) {
      this.appendService(id, serv);
    }
  }

  public appendService(id: number, serv: string): void {
    this.arrayServices.push({ id: id });
    document.getElementById(serv).style.backgroundColor = "#b9cebf";
    document.getElementById(serv).style.color = "black";
    document.getElementById(serv).style.borderRadius = "10px";
    this.selectedServices++;
    this.availableServices--;
  }

  public deleteService(index: number, id: number, serv: string): void {
    this.arrayServices.splice(index, 1)
    document.getElementById(serv).style.backgroundColor = "#e9e9e9";
    document.getElementById(serv).style.color = "black";
    this.selectedServices--;
    this.availableServices++;
  }

  public async save() {

    if(this.marker == null){
    await this.onAddressBlur();
    }

    if (this.validAddress == false) {
      const confirmSave = await this.showConfirm();
      if (!confirmSave) {
        return;
      }
    }
    //Ordenamos el array de coworkings
    this.arrayServices.sort((a: any, b: any) => a.id - b.id);
    const coworking = {
      cw_name: this.coworkingForm.getFieldValue('cw_name'),
      cw_description: this.coworkingForm.getFieldValue('cw_description'),
      cw_address: this.coworkingForm.getFieldValue('cw_address'),
      cw_location: this.coworkingForm.getFieldValue('cw_location'),
      cw_capacity: this.coworkingForm.getFieldValue('cw_capacity'),
      cw_daily_price: this.coworkingForm.getFieldValue('cw_daily_price'),
      cw_image: this.coworkingForm.getFieldValue('cw_image'),
      cw_lat: this.mapLat,
      cw_lon: this.mapLon,
      services: this.arrayServices
    }

    this.insert(coworking);
    this.coworkingForm.clearData();
    this.router.navigateByUrl("/main/mycoworkings");
  }

  public insert(coworking: any) {
    this.service.insert(coworking, 'coworking').subscribe(data => {
      this.showConfigured();
    });
  }

  public cancel() {
    this.onInsertSuccess();
  }

  isInvalidForm(): boolean {
    return !this.coworkingForm || this.coworkingForm.formGroup.invalid || this.marker == null;
  }

  public showConfigured() {
    const action = this.translate.get('COWORKING_CREATE')
    const configuration: OSnackBarConfig = {
      action: action,
      milliseconds: 5000,
      icon: 'check_circle',
      iconPosition: 'left'
    };
    this.snackBarService.open('', configuration);
  }

  // ---------------------- MAPA ----------------------
  public onAddressBlur(): void {
    const selectedCityId = this.combo.getValue();
    const address = this.address.getValue();
    const cityObject = this.combo.dataArray.find(city => city.id_city === selectedCityId);
    const cityName = cityObject ? cityObject.city : null;
    if (!cityName || !address) {
      this.snackBar(this.translate.get("INVALID_LOCATION"));
      return;
    }

    this.mapService.getCoordinates(cityName,address).then((results) => {
      if (results) {
        let [lat, lon] = results.split(';')
        this.mapLat = lat;
        this.mapLon = lon;
        if (this.coworking_map && this.coworking_map.getMapService()) {
          if (this.leafletMap) {
            this.leafletMap.setView([+lat, +lon], 16);
          } else {
            console.error('El mapa no está inicializado.');
          }
        } else {
          console.error('El servicio del mapa no está disponible.');
        }
        this.validAddress = true;
        console.log("validAddress: ", this.validAddress);
        this.addMarker(+lat, +lon);
      } else {
        this.snackBar(this.translate.get("INVALID_LOCATION_ADDRESS"));
        this.mapService.getCityCoordinates(cityName).then((results) => {
          let [lat, lon] = results.split(';')
          this.mapLat = lat;
          this.mapLon = lon;
          if (this.coworking_map && this.coworking_map.getMapService()) {
            if (this.leafletMap) {
              this.leafletMap.setView([+lat, +lon], 12);
            } else {
              console.error('El mapa no está inicializado.');
            }
          } else {
            console.error('El servicio del mapa no está disponible.');
          }
          this.validAddress = true;
          console.log("validAddress: ", this.validAddress);
          this.addMarker(+lat, +lon);
        })
      };
    });
  }

  private addMarker(lat: number, lon: number): void {
    if(this.marker != null){
      this.leafletMap.removeLayer(this.marker);
      this.marker = null;
    } 
    this.marker = L.marker([this.mapLat, this.mapLon], { draggable: true }).addTo(this.leafletMap);
    // Escuchar el evento de movimiento del marcador
      this.marker.on('dragend', (event: any) => {
          const marker = event.target;
          const position = marker.getLatLng();
          this.mapLat = position.lat;
          this.mapLon = position.lng;
          this.coworkingForm.getFieldReference('cw_lat').setValue(position.lat);
          this.coworkingForm.getFieldReference('cw_lon').setValue(position.lng);
        });
  }

  private snackBar(message: string): void {
    this.snackBarService.open(message, {
      milliseconds: 5000,
      icon: 'error',
      iconPosition: 'left'
    });
  }

  private async showConfirm(): Promise<boolean> {
    return new Promise((resolve) => {
      const confirmMessageTitle = this.translate.get("BOOKINGS_INSERT");
      const confirmMessage = this.translate.get("INVALID_LOCATION_CONFIRM");
      this.dialogService.confirm(confirmMessageTitle, confirmMessage).then((result) => {
        if (result) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}
