import { Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ODateInputComponent, OFormComponent, OntimizeService, OSnackBarConfig, SnackBarService } from 'ontimize-web-ngx';

@Component({
  selector: 'app-coworkings-edit',
  templateUrl: './coworkings-edit.component.html',
  styleUrls: ['./coworkings-edit.component.css']
})
export class CoworkingsEditComponent {
  public today: string = new Date().toLocaleDateString();
  public arrayServices:any[];
  public exist = false;
  public selectedServices:number = 0;
  protected service: OntimizeService;

  @ViewChild("coworkingForm") coworkingForm: OFormComponent;
  @ViewChild("startDate") coworkingStartDate: ODateInputComponent;
  @ViewChild("endDate") coworkingEndDate: ODateInputComponent;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    protected injector:Injector,
    protected snackBarService: SnackBarService
  ) {
    this.service = this.injector.get(OntimizeService);
    this.arrayServices = [];
  }

  ngOnInit(): void {
    this.configureService();
  }

  protected configureService(){
    const conf = this.service.getDefaultServiceConfiguration('coworkings');
    this.service.configureService(conf);
  }

  public onInsertSuccess(): void {
    console.log("Test");
    this.router.navigateByUrl("/main/mycoworkings")
  }

  public selectService(id:number, serv:string):void{
    this.exist = false;
    for (let i = 0; i < this.arrayServices.length; i++) {
      if(this.arrayServices[i].id === id){
        this.exist = true;
        this.deleteService(i, id, serv);
      }
    }
    if (!this.exist) {
      this.appendService(id, serv);
    }
  }

  public appendService(id:number, serv:string):void{
    this.arrayServices.push({id:id});
    document.getElementById(serv).style.backgroundColor = "#e6d5c3";
    document.getElementById(serv).style.color = "black;";
    this.selectedServices ++;
  }

  public deleteService(index:number, id:number, serv:string):void{
    this.arrayServices.splice(index, 1)
    document.getElementById(serv).style.backgroundColor = "whitesmoke";
    document.getElementById(serv).style.color ="black";
    this.selectedServices --;
  }

  /**
   * Método que se llama desde el botón de guardado
   */
  public save(){
    //Ordenamos el array de coworkings
    this.arrayServices.sort((a:any, b:any) => a.id - b.id);
    //Creamos un objeto coworking
    const coworking = {
      cw_id:this.coworkingForm.getFieldValue('cw_id'),
      cw_name:this.coworkingForm.getFieldValue('cw_name'),
      cw_description:this.coworkingForm.getFieldValue('cw_description'),
      cw_address:this.coworkingForm.getFieldValue('cw_address'),
      cw_location:this.coworkingForm.getFieldValue('cw_location'),
      cw_capacity:+this.coworkingForm.getFieldValue('cw_capacity'),
      cw_daily_price:+this.coworkingForm.getFieldValue('cw_daily_price'),
      cw_image:this.coworkingForm.getFieldValue('cw_image'),
      services:this.arrayServices
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
  public update(coworking:any):void{
    const keyMap = {cw_id:this.coworkingForm.getFieldValue('cw_id')}
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
        action: '¡Coworking actualizado!',
        milliseconds: 5000,
        icon: 'check_circle',
        iconPosition: 'left'
    };
    this.snackBarService.open('¡Coworking actualizado!', configuration);
  }

  showServices(cw_id: any):any{
    //Vaciamos el array
    this.arrayServices=[];
    /*Verificamos que cw_id no sea undefined
    para que aplique el filtro y así no traer todos los registros de la tabla pivote cw_service*/
    if(cw_id != undefined){
      const filter = {cw_id: cw_id}
      //Creamos el servicio
      const conf = this.service.getDefaultServiceConfiguration("cw_services");
      this.service.configureService(conf);
      const columns = ["id"];
      //Hacemos la petición
      return this.service
        .query(filter, columns, "servicePerCoworking")
        .subscribe((resp) =>{
          //Obtenemos resp (respuesta) del servidor, y recorremos el array de servicios (data)
          for (let index = 0; index < resp.data.length; index++) {
            document.getElementById('sel' + resp.data[index]['id']).style.backgroundColor = "#e6d5c3";
            //Guardamos el id que devuelve data situado en esa posición del array
            let obj = resp.data[index]['id'];
            this.arrayServices.push({id:obj}); //Con el valor, creamos un objeto y lo guardamos en el array de servicios
            this.selectedServices++; //Sumamos 1 a los servicios seleccionados
          }
        }
      );
    }
  }
}
