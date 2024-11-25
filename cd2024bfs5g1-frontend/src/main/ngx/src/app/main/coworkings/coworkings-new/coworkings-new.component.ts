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

  @ViewChild("coworkingForm") coworkingForm: OFormComponent;
  @ViewChild("startDate") coworkingStartDate: ODateInputComponent;
  @ViewChild("endDate") coworkingEndDate: ODateInputComponent;
  @ViewChild("coworkingMap") coworkingMap: OMapComponent;

  constructor(
    private router: Router,
    private translate: OTranslateService,
    protected injector: Injector,
    protected snackBarService: SnackBarService
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
      console.log(data);
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

  checkAddress() {
    const address = this.coworkingForm.getFieldValue('cw_address');
    const city = this.coworkingForm.getFieldValue('cw_location');
    if (city != "" && address != "") {
      this.setMapPosition(city, address);
    }
  }

  checkLocation() {
    const address = this.coworkingForm.getFieldValue('cw_address');
    const city = this.coworkingForm.getFieldValue('cw_location');
    if (city != "" && address != "") {
      this.setMapPosition(city, address);
    }
  }

  setMapPosition(city: string, address: string) {
    const mapAddress = "Spain, " + city + ", " + address;
    let centerLatLong;

    // Genero consulta contra la api de búsqueda
    // let resultAddress = new OMapWSearch().search(mapAddress);
    //let resultAddress = this.coworkingMap.sSearchControl(mapAddress);
    let resultAddress = this.coworkingMap.mapSearchers[0].search(mapAddress);
    // Recupero los valores de la api

    // Consulto la información del primer elemento de resultAddress


    // Debemos recuperar la longitud y latitud de la dirección pasada
    // const mapSearch = this.coworkingMap.geo;
    const mapSearcher = this.coworkingMap.mapSearchers.values();

    // this.coworkingMap.
    if (centerLatLong != "") {
      this.coworkingMap.setCenter(centerLatLong);
    }
  }

}
