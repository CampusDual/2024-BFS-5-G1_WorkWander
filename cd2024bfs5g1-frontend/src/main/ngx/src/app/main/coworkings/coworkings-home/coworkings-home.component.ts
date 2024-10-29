import { Component, Injector, OnInit } from '@angular/core';
import { OntimizeService } from 'ontimize-web-ngx';

@Component({
  selector: 'app-coworkings-home',
  templateUrl: './coworkings-home.component.html',
  styleUrls: ['./coworkings-home.component.css']
})
export class CoworkingsHomeComponent implements OnInit{
  public arrayServices:any=[];
  protected service: OntimizeService;

  constructor(protected injector:Injector){
    this.service = this.injector.get(OntimizeService);
  }

  ngOnInit(): void {
    this.configureService();
  }

  protected configureService(){
    const conf = this.service.getDefaultServiceConfiguration('coworkings');
    this.service.configureService(conf);
  }

  public serviceList(cwId:any):void{
    const filter = {
      "cw_id":cwId
    }
    const columns = ["cw_id"];
    console.log(cwId);
    /*this.service.query(filter, columns, 'serviceCoworking').subscribe(data => {
      console.log(data);
    });*/

  }
}
