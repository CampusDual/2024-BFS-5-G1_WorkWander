import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-coworkings-home',
  templateUrl: './coworkings-home.component.html',
  styleUrls: ['./coworkings-home.component.css']
})
export class CoworkingsHomeComponent implements OnInit{

  constructor(
    protected dialog: MatDialog,
    protected sanitizer: DomSanitizer
  ) {}

  ngOnInit() {

  }

  public getImageSrc(base64: any): any {
    console.log(base64);
    return base64 ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + base64) : './assets/images/coworking-default.jfif';
    
    // return base64 ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + base64.bytes) : './assets/images/coworking-default.jfif';
  }

}
