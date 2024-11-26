import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  OComboComponent,
  ODateInputComponent,
  OFormComponent,
  OntimizeService, OSnackBarConfig,
  OTextInputComponent,
  OTranslateService,
  SnackBarService,
} from "ontimize-web-ngx";
import { OMapComponent } from "ontimize-web-ngx-map";

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
  _eventsArray: Array<any> = [];

  // mapId: number = 0;
  mapLat: string = "42.240599";
  mapLon: string = "-8.720727";
  center: string = this.mapLat + ";" + this.mapLon;

  zoom: number = 16; // Zoom inicial


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
    private http: HttpClient
  ) {
    this.service = this.injector.get(OntimizeService);
  }

  ngOnInit(): void {
    this.configureService();
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
    document.getElementById(serv).style.backgroundColor = "#e6d5c3";
    document.getElementById(serv).style.color = "black;";
    this.selectedServices++;
    this.availableServices--;
  }

  public deleteService(index: number, id: number, serv: string): void {
    this.arrayServices.splice(index, 1)
    document.getElementById(serv).style.backgroundColor = "whitesmoke";
    document.getElementById(serv).style.color = "black";
    this.selectedServices--;
    this.availableServices++;
  }

  public save() {
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
    return !this.coworkingForm || this.coworkingForm.formGroup.invalid;
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

  onAddressBlur(): void {
    const selectedCityId = this.combo.getValue();
    const address = this.address.getValue();
    const cityObject = this.combo.dataArray.find(city => city.id_city === selectedCityId);
    const cityName = cityObject ? cityObject.city : null;

    if (!cityName) {
      this.snackBar('Por favor, selecciona una localidad válida.');
      return;
    }

    const addressComplete = address ? `${address}, ${cityName}` : cityName;

    this.getCoordinatesForCity(addressComplete).then((coords) => {
      if (coords) {
        this.center = coords;
        this.zoom = address ? 18 : 12;
        //this.addMarkers(coords); // Añadir marcador -> en proceso!!!
      } else {
        this.snackBar(`No se pudo encontrar ${address ? 'la dirección' : 'el municipio'}.`);
      }
    });
  }

  //Es async porque realiza una solicitud HTTP para obtener datos de una API externa. responde = await porque se espera a que la solicitud HTTP se complete y devuelva una respuesta.
  private async getCoordinatesForCity(location: string): Promise<string | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&countrycodes=es&format=json`;
      const response = await this.http.get<any>(url).toPromise();
      console.log(response);
      if (response?.length > 0) {
        const { lat, lon } = response[0];
        return `${lat};${lon}`;
      } else {
        this.snackBar(`No se encontraron resultados para: ${location}`);
      }
    } catch (error) {
      this.snackBar(`Error al consultar la API: ${error}`);
    }
    return null;
  }


  // private addMarkers(results: any[]): void { EN PROCESOOOO!!
  // results.forEach(result => {
  //   const lat = parseFloat(result.lat);
  //   const lon = parseFloat(result.lon);
  //   const marker = this.coworkingMap.getMapService().addMarker([lat, lon]);
  //   this.coworkingMap.getMapService().addLayer(marker);
  // });


  private snackBar(message: string): void {
    this.snackBarService.open(message, {
      milliseconds: 5000,
      icon: 'error',
      iconPosition: 'left'
    });
  }

  // Metodos para controlar el draw dentro del mapa
  // ngAfterViewInit() {
  //   this.getDrawLayer();
  // }

  // getDrawLayer() {
  //   console.log(this.coworking_map.getMapService().getDrawLayer());
  // }

  // addDrawEvent(arg) {
  //   this._eventsArray.push(arg);
  // }

  // get eventsArray(): Array<any> {
  //   return this._eventsArray;
  // }

  // set eventsArray(arg: Array<any>) {
  //   this._eventsArray = arg;
  // }

}
