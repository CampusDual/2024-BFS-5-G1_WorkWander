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
  public arrayServices:any=[];
  public exist = false;
  public availableServices:number = 6;
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
    this.availableServices --;
  }

  public deleteService(index:number, id:number, serv:string):void{
    this.arrayServices.splice(index, 1)
    document.getElementById(serv).style.backgroundColor = "whitesmoke";
    document.getElementById(serv).style.color ="black";
    this.selectedServices --;
    this.availableServices ++;
  }

  public save(){    
    const coworking = {
      cw_name:this.coworkingForm.getFieldValue('cw_name'),
      cw_description:this.coworkingForm.getFieldValue('cw_description'),
      cw_address:this.coworkingForm.getFieldValue('cw_address'),
      cw_location:this.coworkingForm.getFieldValue('cw_location'),
      cw_capacity:+this.coworkingForm.getFieldValue('cw_capacity'),
      cw_daily_price:+this.coworkingForm.getFieldValue('cw_daily_price'),
      cw_image:this.coworkingForm.getFieldValue('cw_image'),
      services:this.arrayServices
    }
    
    this.update(coworking);
    this.coworkingForm._clearAndCloseFormAfterInsert();
  }

  public update(coworking:any){
    const keyMap = {cw_id:this.coworkingForm.getFieldValue('cw_id')}
    this.service.update(keyMap, coworking, 'coworking').subscribe(data => {
      console.log(data);
      this.showConfigured();
    });
  }

  isInvalidForm(): boolean {
    return !this.coworkingForm || this.coworkingForm.formGroup.invalid;
  }

  public showConfigured() {
    const configuration: OSnackBarConfig = {
        action: '¡Coworking actualizado!',
        milliseconds: 5000,
        icon: 'check_circle',
        iconPosition: 'left'
    };
    this.snackBarService.open('¡Coworking actualizado!', configuration);
  }

  showServices(cw_id: any):any{
    const filter = {cw_id: cw_id}
    console.log(filter)
    const conf = this.service.getDefaultServiceConfiguration("cw_services");
    this.service.configureService(conf);
    const columns = ["id"];
    return this.service
      .query(filter, columns, "servicePerCoworking")
      .subscribe((resp) =>{
        this.arrayServices = resp.data
        this.selectedServices = this.arrayServices.length
        if (this.arrayServices.length > 0) {
          for (let index = 0; index < this.arrayServices.length; index++) {
            document.getElementById('sel' + this.arrayServices[index]['id']).style.backgroundColor = "#e6d5c3";
          }
        }
      });

  }
}
