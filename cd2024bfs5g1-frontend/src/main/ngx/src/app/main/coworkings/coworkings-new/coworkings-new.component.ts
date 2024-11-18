import { AfterViewInit, Component, Injector, OnInit, ViewChild } from "@angular/core";
import {
  OFormComponent,
  ODateInputComponent,
  OTranslateService,
} from "ontimize-web-ngx";
import { Router } from "@angular/router";
import { OntimizeService, OSnackBarConfig, SnackBarService } from 'ontimize-web-ngx';

@Component({
  selector: "app-coworking-new",
  templateUrl: "./coworkings-new.component.html",
  styleUrls: ["./coworkings-new.component.css"],
})

export class CoworkingsNewComponent implements OnInit{
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
    private translate: OTranslateService,
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
    this.coworkingForm.setInitialMode();
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
    //Ordenamos el array de coworkings
    this.arrayServices.sort((a:any, b:any) => a.id - b.id);
    const coworking = {
      cw_name:this.coworkingForm.getFieldValue('cw_name'),
      cw_description:this.coworkingForm.getFieldValue('cw_description'),
      cw_address:this.coworkingForm.getFieldValue('cw_address'),
      cw_location:this.coworkingForm.getFieldValue('cw_location'),
      cw_capacity:this.coworkingForm.getFieldValue('cw_capacity'),
      cw_daily_price:this.coworkingForm.getFieldValue('cw_daily_price'),
      cw_image:this.coworkingForm.getFieldValue('cw_image'),
      services:this.arrayServices
    }
    this.insert(coworking);
    this.coworkingForm.clearData();
    this.router.navigateByUrl("/main/mycoworkings");
  }

  public insert(coworking:any){
    this.service.insert(coworking, 'coworking').subscribe(data => {
      console.log(data);
      this.showConfigured();
    });
  }

  public cancel(){
    this.onInsertSuccess();
  }

  isInvalidForm(): boolean {
    return !this.coworkingForm || this.coworkingForm.formGroup.invalid;
  }

  public showConfigured() {
    const configuration: OSnackBarConfig = {
        action: '¡Coworking creado!',
        milliseconds: 5000,
        icon: 'check_circle',
        iconPosition: 'left'
    };
    this.snackBarService.open('¡Coworking creado!', configuration);
  }
}
