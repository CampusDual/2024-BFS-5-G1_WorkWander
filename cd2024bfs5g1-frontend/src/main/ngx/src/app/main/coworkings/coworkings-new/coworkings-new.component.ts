import { AfterViewInit, Component, Injector, OnInit, ViewChild } from "@angular/core";
import {
  OFormComponent,
  ODateInputComponent,
  OTranslateService,
  OComboComponent,
  OTextInputComponent,
} from "ontimize-web-ngx";
import { Router } from "@angular/router";
import { OntimizeService, OSnackBarConfig, SnackBarService } from 'ontimize-web-ngx';
import { OMapComponent } from "ontimize-web-ngx-map";
import { HttpClient } from '@angular/common/http';

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
  toastService: any;

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

  //Metodos mapa usando api externa
  onMunicipalityChange(): void {
    const selectedCityId = this.combo.getValue();

    const cityObject = this.combo.dataArray.find((city) => city.id_city === selectedCityId);
    const cityName = cityObject ? cityObject.city : null;

    if (cityName) {
      this.getCoordinatesForCity(cityName).then((coords) => {

        if (coords && /^[+-]?\d+(\.\d+)?;[+-]?\d+(\.\d+)?$/.test(coords)) {
          this.center = coords;
          this.zoom = 12;
        } else {
          this.showToast('Formato inválido de coordenadas: ' + coords);
        }

      });
    } else {
      this.showToast('No se encontró el nombre para el ID de ciudad seleccionado');
    }
  }

  private async getCoordinatesForCity(city: string): Promise<string | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ', Spain')}&countrycodes=es&format=json`;
      const response = await this.http.get<any>(url).toPromise();

      if (response && response.length > 0) {
        this.mapLat = response[0].lat;
        this.mapLon = response[0].lon;
        return `${this.mapLat};${this.mapLon}`;
      } else {
        this.showToast('No se encontraron resultados para la ciudad: ' + city);
      }
    } catch (error) {
      this.showToast('Error al consultar la API: ' + error);
    }
    return null;
  }

  onAddressBlur(): void {
    const selectedCityId = this.combo.getValue();
    const address = this.address.getValue();

    if (selectedCityId && address) {
      this.getCoordinatesForCity(address).then((coords) => {
        if (coords) {
          this.center = coords;
          this.zoom = 18;
        } else {
          this.showToast('No se pudo encontrar la dirección. Mostrando el municipio.');
          this.getCityCoordinatesById(selectedCityId);
        }
      });
    } else if (selectedCityId) {
      this.getCityCoordinatesById(selectedCityId);
    } else {
      this.showToast('Por favor, selecciona un municipio o ingresa una dirección válida.');
    }
  }

  private getCityCoordinatesById(cityId: number): void {
    const cityObject = this.combo.dataArray.find((city) => city.id_city === cityId);
    const cityName = cityObject ? cityObject.city : null;

    if (cityName) {
      this.getCoordinatesForCity(cityName).then((coords) => {
        if (coords) {
          this.center = coords;
          this.zoom = 12;
        } else {
          this.showToast('No se pudieron encontrar coordenadas para el municipio.');
        }
      });
    }
  }

  private showToast(message: string): void {
    this.toastService.show(message, {
      classname: 'bg-danger text-light',
      delay: 5000
    });
  }

  // Metodos para controlar el draw dentro del mapa
  ngAfterViewInit() {
    this.getDrawLayer();
  }

  getDrawLayer() {
    console.log(this.coworking_map.getMapService().getDrawLayer());
  }

  addDrawEvent(arg) {
    this._eventsArray.push(arg);
  }

  get eventsArray(): Array<any> {
    return this._eventsArray;
  }

  set eventsArray(arg: Array<any>) {
    this._eventsArray = arg;
  }

}
