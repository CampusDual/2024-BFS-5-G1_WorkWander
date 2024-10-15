import { Component, ElementRef, Inject, Injector, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, OEmailInputComponent, OFormComponent, OntimizeService, OPasswordInputComponent, OTextInputComponent } from 'ontimize-web-ngx'; // Servicio para que se pueda usar en el TS las funciones de Ontimize

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})

export class UserRegisterComponent implements OnInit {

  @ViewChild('registerForm') public registerForm: OFormComponent;
  @ViewChild('nameInput') public userCtrl: OTextInputComponent;
  @ViewChild('emailInput') public emailCtrl: OEmailInputComponent;
  @ViewChild('passInput')  public pwdCtrl: OPasswordInputComponent;

  // @ViewChild('emailInput', {read: ElementRef}) public emailInputElement: ElementRef;


  protected service: OntimizeService;
  private redirect = '/main';


  constructor(protected injector: Injector,
    @Inject(AuthService) private authService: AuthService,
    private router: Router) 
    {
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
            if (resp.data && resp.data.length > 0) {

              // resp.data contains the data retrieved from the server
              
              // this.emailInputElement.nativeElement.querySelector('input').focus();  // Establecer el focus
              alert('Email ya existe')

            } else {
            }
          });

     }

  }


logUser(){
  const userName = this.userCtrl.getValue();
  const password = this.pwdCtrl.getValue();
  
    const self = this;
    this.authService.login(userName, password)
      .subscribe(() => {
        self.router.navigate([this.redirect]);
      });
  
  
}


  checkUserName() {
    const user = this.userCtrl.getValue();

    console.error("This: -" + this.userCtrl.getValue()  + "-");

    if (user && user.length > 0 )
      {
          const filter = {'usr_email': user};
          const columns = ['usr_id'];

          this.service.query(filter, columns, 'user').subscribe(resp => {
            if (resp.data && resp.data.length > 0) {

              // resp.data contains the data retrieved from the server
              alert('Usuario ya existe')

            } else {
            }
          });

     }


  }




}
