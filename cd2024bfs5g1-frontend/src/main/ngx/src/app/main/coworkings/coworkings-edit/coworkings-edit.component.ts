import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, OComboComponent, ODateInputComponent, OFormComponent, OntimizeService, OSnackBarConfig, OTextInputComponent, OTranslateService, SnackBarService } from 'ontimize-web-ngx';
import { OMapComponent } from "ontimize-web-ngx-map";

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
  protected validAddress: boolean;
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
    private translate: OTranslateService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    protected injector: Injector,
    protected snackBarService: SnackBarService,
    protected dialogService: DialogService,
    private http: HttpClient
  ) {
    this.service = this.injector.get(OntimizeService);
    this.arrayServices = [];
  }

  ngOnInit(): void {
    this.configureService();
  }
  inicializarMapa(): void {
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
  
        this.setLocation(cityName, address);
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
    document.getElementById(serv).style.backgroundColor = "#e6d5c3";
    document.getElementById(serv).style.color = "black;";
    this.selectedServices++;
  }

  public deleteService(index: number, id: number, serv: string): void {
    this.arrayServices.splice(index, 1)
    document.getElementById(serv).style.backgroundColor = "whitesmoke";
    document.getElementById(serv).style.color = "black";
    this.selectedServices--;
  }

  /**
   * Método que se llama desde el botón de guardado
   */
  public save() {
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
    const action = this.translate.get('COWORKING_UPDATE')
    const configuration: OSnackBarConfig = {
      action: action,
      milliseconds: 5000,
      icon: 'check_circle',
      iconPosition: 'left'
    };
    this.snackBarService.open('', configuration);
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
            document.getElementById('sel' + resp.data[index]['id']).style.backgroundColor = "#e6d5c3";
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
  setLocation(cityName: string, address: string): void {
    const addressComplete = address ? `${address}, ${cityName}` : cityName;
  
    this.getCoordinatesForCity(addressComplete)
      .then((results) => {
        if (!results) {
          this.snackBar(this.translate.get("ADDRESS_NOT_FOUND"));
          if (this.leafletMap) {
            this.leafletMap.setView([40.416775, -3.703790], 6); // Madrid por defecto
          }
          return;
        }
  
        const [lat, lon] = results.split(';');
        if (this.coworking_map && this.coworking_map.getMapService()) {
          this.leafletMap = this.coworking_map.getMapService().getMap();
          if (this.leafletMap) {
            this.leafletMap.setView([+lat, +lon], 18);
            this.coworking_map.addMarker(
              'coworking_marker',
              +lat,
              +lon,
              { draggable: true },
              this.translate.get("COWORKING_MARKER"),
              false,
              true,
              'Marcador Coworking'
            );
          } else {
            console.error("El mapa no está inicializado.");
          }
        } else {
          console.error("El servicio del mapa no está disponible.");
        }
      })
      .catch((error) => {
        console.error("Error obteniendo coordenadas:", error);
        this.snackBar(this.translate.get("ERROR_RETRIEVING_COORDINATES"));
      });
  }
  

  onAddressBlur(): void {
    const selectedCityId = this.combo.getValue();
    const address = this.address.getValue();
    const cityObject = this.combo.dataArray.find(city => city.id_city === selectedCityId);
    const cityName = cityObject ? cityObject.city : null;

    if (!cityName || !address) {
      return;
    }

    const addressComplete = address ? `${address}, ${cityName}` : cityName;
    this.getCoordinatesForCity(addressComplete).then((results) => {
      if (results) {
        let [lat, lon] = results.split(';')
        if (this.coworking_map && this.coworking_map.getMapService()) {
          this.leafletMap = this.coworking_map.getMapService().getMap();
          if (this.leafletMap) {
            this.leafletMap.setView([+lat, +lon], 18);
          } else {
            console.error('El mapa no está inicializado.');
          }
        } else {
          console.error('El servicio del mapa no está disponible.');
        }
        this.validAddress = true;
        this.coworking_map.addMarker(
          'coworking_marker',           // id
          lat,                 // latitude
          lon,                 // longitude
          { draggable: true },       // options
          this.translate.get("COWORKING_MARKER"),     // popup
          false,                     // hidden
          true,                      // showInMenu
          'Marcador Coworking'   // menuLabel
        );
      } else {
        //Si se ingresa una direccion que la api no reconoce -> Reseteo de la vista a Madrid y zoom 6
        this.snackBar(this.translate.get("ADDRESS_NOT_FOUND"));
        this.leafletMap.setView([40.416775, -3.703790], 6);
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

  private waitForDataReady(maxRetries = 20, intervalMs = 1000): Promise<void> {
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
