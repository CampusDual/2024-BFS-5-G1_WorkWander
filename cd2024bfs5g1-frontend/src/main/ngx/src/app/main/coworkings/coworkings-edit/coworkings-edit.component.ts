import { HttpClient } from '@angular/common/http';
import { Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, OComboComponent, ODateInputComponent, OFormComponent, OntimizeService, OSnackBarConfig, OTextInputComponent, OTranslateService, SnackBarService } from 'ontimize-web-ngx';
import { OMapComponent } from 'ontimize-web-ngx-map';
import * as L from 'leaflet';
import { CustomMapService } from 'src/app/shared/services/custom-map.service';
@Component({
  selector: 'app-coworkings-edit',
  templateUrl: './coworkings-edit.component.html',
  styleUrls: ['./coworkings-edit.component.css']
})
export class CoworkingsEditComponent {
  public today: string = new Date().toLocaleDateString();
  public arrayServices: any[];
  public exist = false;
  public selectedServices: number = 0;
  protected service: OntimizeService;
  leafletMap: any;
  marker: L.marker;
  protected validAddress: boolean;
  protected mapLat: number; //Latitud
  protected mapLon: number; //Longitud

  @ViewChild("coworkingForm") coworkingForm: OFormComponent;
  @ViewChild("startDate") coworkingStartDate: ODateInputComponent;
  @ViewChild("endDate") coworkingEndDate: ODateInputComponent;
  @ViewChild("coworking_map") coworking_map: OMapComponent;
  @ViewChild('combo') combo: OComboComponent;
  @ViewChild('address') address: OTextInputComponent;

  constructor(
    private translate: OTranslateService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    protected injector: Injector,
    protected snackBarService: SnackBarService,
    protected dialogService: DialogService,
    protected mapService: CustomMapService,
    private http: HttpClient
  ) {
    this.service = this.injector.get(OntimizeService);
    this.arrayServices = [];
  }

  ngOnInit(): void {
    this.configureService();
  }
  inicializarMapa(lat: number, lon: number): void {
    this.leafletMap = this.coworking_map.getMapService().getMap();
    let mapLat = lat;
    let mapLon = lon;
    

    if (!mapLat && !mapLon) {
      mapLat = this.coworkingForm.getFieldValue('cw_lat');
      mapLon = this.coworkingForm.getFieldValue('cw_lon');
    }

    if (mapLat && mapLon) {
      this.updateMapAndMarker(`${lat};${lon}`, 16);
      console.log('Direccion por cooords');
      return;
    }

    // Esperar hasta que los datos estén listos
    this.waitForDataReady()
      .then(() => {
        const selectedCityId = this.combo.getValue();
        const address = this.address.getValue();
        const cityObject = this.combo.dataArray.find(city => city.id_city === selectedCityId);
        const cityName = cityObject ? cityObject.city : null;

        if (!cityName || !address) {
          this.snackBar(this.translate.get("INVALID_LOCATION"));
          return;
        }

        this.mapaShow(cityName, address);
        console.log('Direccion por combo');

      })
      .catch((error) => {
        console.error("Error al inicializar el mapa:", error);
        this.snackBar(this.translate.get("ERROR_INITIALIZING_MAP"));
      });
  }
  protected configureService() {
    const conf = this.service.getDefaultServiceConfiguration('coworkings');
    this.service.configureService(conf);
  }

  public onInsertSuccess(): void {
    console.log("Test");
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
  }

  public deleteService(index: number, id: number, serv: string): void {
    this.arrayServices.splice(index, 1)
    document.getElementById(serv).style.backgroundColor = "#e9e9e9";
    document.getElementById(serv).style.color = "black";
    this.selectedServices--;
  }

  /**
   * Método que se llama desde el botón de guardado
   */
  public async save() {
    const address = this.address.getValue();
    const selectedCityId = this.combo.getValue();
    const cityObject = this.combo.dataArray.find(city => city.id_city === selectedCityId);
    const cityName = cityObject ? cityObject.city : null;

        if (!this.validAddress) {
            const confirmSave = await this.showConfirm();
            if (!confirmSave) {
                this.snackBar(this.translate.get("INVALID_LOCATION"));
                return;
            }
        }

    //Ordenamos el array de coworkings
    this.arrayServices.sort((a: any, b: any) => a.id - b.id);
    //Creamos un objeto coworking
    const coworking = {
      cw_id: this.coworkingForm.getFieldValue('cw_id'),
      cw_name: this.coworkingForm.getFieldValue('cw_name'),
      cw_description: this.coworkingForm.getFieldValue('cw_description'),
      cw_address: this.coworkingForm.getFieldValue('cw_address'),
      cw_location: this.coworkingForm.getFieldValue('cw_location'),
      cw_capacity: +this.coworkingForm.getFieldValue('cw_capacity'),
      cw_daily_price: +this.coworkingForm.getFieldValue('cw_daily_price'),
      cw_image: this.coworkingForm.getFieldValue('cw_image'),
      cw_lat: this.mapLat,
      cw_lon: this.mapLon,
      services: this.arrayServices
    }

    //Llamamos a la función para actualizar, enviando el objeto
    this.update(coworking);
    this.showUpdated();
    this.coworkingForm._clearAndCloseFormAfterInsert();
  }

  /**
   * Actualización, recibe un objeto coworking,
   * se llama desde save()
   * @param coworking
   */
  public update(coworking: any): void {
    const keyMap = { cw_id: this.coworkingForm.getFieldValue('cw_id') }
    const conf = this.service.getDefaultServiceConfiguration('coworkings');
    this.service.configureService(conf);
    this.service.update(keyMap, coworking, 'coworking').subscribe(data => {
      console.log(data);
    });
  }

  isInvalidForm(): boolean {
    return !this.coworkingForm || this.coworkingForm.formGroup.invalid;
  }

  public showUpdated() {
    const configuration: OSnackBarConfig = {
      milliseconds: 5000,
      icon: 'check_circle',
      iconPosition: 'left'
    };
    this.snackBarService.open(this.translate.get('COWORKING_UPDATE'), configuration);
  }

  showServices(cw_id: any): any {
    //Vaciamos el array
    this.arrayServices = [];
    /*Verificamos que cw_id no sea undefined
    para que aplique el filtro y así no traer todos los registros de la tabla pivote cw_service*/
    if (cw_id != undefined) {
      const filter = { cw_id: cw_id }
      //Creamos el servicio
      const conf = this.service.getDefaultServiceConfiguration("cw_services");
      this.service.configureService(conf);
      const columns = ["id"];
      //Hacemos la petición
      return this.service
        .query(filter, columns, "servicePerCoworking")
        .subscribe((resp) => {
          //Obtenemos resp (respuesta) del servidor, y recorremos el array de servicios (data)
          for (let index = 0; index < resp.data.length; index++) {
            document.getElementById('sel' + resp.data[index]['id']).style.backgroundColor = "#b9cebf";
            document.getElementById('sel' + resp.data[index]['id']).style.borderRadius = "10px";
            //Guardamos el id que devuelve data situado en esa posición del array
            let obj = resp.data[index]['id'];
            this.arrayServices.push({ id: obj }); //Con el valor, creamos un objeto y lo guardamos en el array de servicios
            this.selectedServices++; //Sumamos 1 a los servicios seleccionados
          }
        }
        );
    }
  }
  // ---------------------- MAPA ----------------------
  onAddressBlur() {
    const address = this.address.getValue();
    this.validAddress = false; // Invalida la dirección por defecto

    const selectedCityId = this.combo.getValue();
    const cityObject = this.combo.dataArray.find(city => city.id_city === selectedCityId);
    const cityName = cityObject ? cityObject.city : null;

    if (cityName && address) {
        this.mapaShow(cityName, address);
    }
}

  async mapaShow(selectedCity: string, address: string): Promise<void> {

    try {
      const addressResults = await this.mapService.getCoordinates(selectedCity, address);
      if (addressResults) {
        this.updateMapAndMarker(addressResults, 16);
        this.validAddress = true;
        return;
      }
      console.log("Dirección no válida, intentando con la ciudad seleccionada...");
      const cityResults = await this.mapService.getCityCoordinates(selectedCity);
      if (cityResults) {
        this.updateMapAndMarker(cityResults, 12);
        this.snackBar(this.translate.get("INVALID_LOCATION_ADDRESS"));
      }
    } catch (error) {
      console.error("Error al procesar la ubicación:", error);

    }
    this.validAddress = false;
  }

  private updateMapAndMarker(
    coordinates: string,
    zoom: number) {
    const [lat, lon] = coordinates.split(';').map(Number);
    this.leafletMap.setView([+lat, +lon], zoom);
      this.mapLat = lat;
      this.mapLon = lon;
      this.validAddress = true;
      // Borrar marcador anterior
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
      const confirmMessageTitle = this.translate.get("CONFIRM2");
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

  private waitForDataReady(maxRetries = 20, intervalMs = 500): Promise<void> {
    let retries = 0;

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const selectedCityId = this.combo.getValue();
        const address = this.address.getValue();
        const cityObject = this.combo.dataArray.find(city => city.id_city === selectedCityId);
        const cityName = cityObject ? cityObject.city : null;

        if (cityName && address) {
          clearInterval(interval);
          resolve();
        } else if (retries >= maxRetries) {
          clearInterval(interval);
          reject("Datos no disponibles después de múltiples intentos.");
        }

        retries++;
      }, intervalMs);
    });
  }
}
