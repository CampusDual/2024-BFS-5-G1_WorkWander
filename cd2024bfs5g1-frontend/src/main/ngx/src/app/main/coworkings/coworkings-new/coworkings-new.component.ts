import { AfterViewInit, Component, ViewChild } from "@angular/core";
import {
  OFormComponent,
  ODateInputComponent,
  OTranslateService,
} from "ontimize-web-ngx";
import { Router } from "@angular/router";

@Component({
  selector: "app-coworking-new",
  templateUrl: "./coworkings-new.component.html",
  styleUrls: ["./coworkings-new.component.css"],
})
export class CoworkingsNewComponent {
  public today: string = new Date().toLocaleDateString();
  public arrayServices:any=[];  
  public exist = false;

  @ViewChild("coworkingForm") coworkingForm: OFormComponent;
  @ViewChild("startDate") coworkingStartDate: ODateInputComponent;
  @ViewChild("endDate") coworkingEndDate: ODateInputComponent;

  constructor(
    private router: Router,
    private translate: OTranslateService,
  ) {}

  public onInsertSuccess(): void {
    this.coworkingForm.setInitialMode();
    this.router.navigateByUrl("/main/mycoworkings")
  }

  public selectService(id:number, name:string):void{   
    this.exist = false;           
    for (let i = 0; i < this.arrayServices.length; i++) {      
      if(this.arrayServices[i].id === id){        
        this.exist = true;         
        this.deleteService(i, id);        
      }
    }    
    if (!this.exist) {
      this.appendService(id, name);
    }           
  }

  public appendService(id:number, name:string){
    this.arrayServices.push({id:id});    
    let selectService = document.getElementById("tagServices");
    let service = document.createElement("div");
    service.setAttribute("id", id+"")    
    service.innerText=name;
    selectService.appendChild(service);
  }

  public deleteService(index:number, id:number){        
    this.arrayServices.splice(index, 1)         
    let element = document.getElementById(id+"");    
    element.remove();    
  }
}
