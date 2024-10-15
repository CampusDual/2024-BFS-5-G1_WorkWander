import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { OEmailInputComponent, OFormComponent, OntimizeService } from 'ontimize-web-ngx'; // Servicio para que se pueda usar en el TS las funciones de Ontimize

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})

export class UserRegisterComponent implements OnInit {

  @ViewChild('registerForm') public registerForm: OFormComponent;
  public userCtrl: UntypedFormControl = new UntypedFormControl('', Validators.required);
  public pwdCtrl: UntypedFormControl = new UntypedFormControl('', Validators.required);
  @ViewChild('emailInput') public emailCtrl: OEmailInputComponent

  protected service: OntimizeService;

  constructor(protected injector: Injector) {
    this.service = this.injector.get(OntimizeService);
    this.configureService()
  }
  protected configureService() {
    // Configure the service using the configuration defined in the `app.services.config.ts` file
    const conf = this.service.getDefaultServiceConfiguration('users');
    this.service.configureService(conf);
  }

  ngOnInit(): void {


    // this.registerForm.addControl('LOGIN', this.userCtrl);
    // this.registerForm.addControl('PASSWORD', this.pwdCtrl);
    // this.registerForm.addControl('EMAIL', this.emailCtrl);

  }

  checkEmail() {
    const email = this.emailCtrl.getValue();

    console.error("This: -" + this.emailCtrl.getValue()  + "-");

    if (email && email.length > 0 )
      {
          const filter = {'usr_email': email};
          const columns = ['usr_id'];

          this.service.query(filter, columns, 'user').subscribe(resp => {
            if (resp.code === 0) {

              // resp.data contains the data retrieved from the server
              alert('Email existe');

            } else {
              alert('Email no existe');
            }
          });

     } else {

      console.error('Must fill an email.');

    }

  }

  checkUserName() {
    // const userName = this.registerForm.value.username;
    // if (userName && userName.length > 0 ) {


    // }else {

    //   console.error('Must fill an username.');

    // }


  }




}
