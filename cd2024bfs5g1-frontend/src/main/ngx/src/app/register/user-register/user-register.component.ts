import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, OButtonComponent, OCheckboxComponent, OEmailInputComponent, OFormComponent, OntimizeService, OPasswordInputComponent, OTextInputComponent } from 'ontimize-web-ngx';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})

export class UserRegisterComponent {

  @ViewChild('registerForm') public registerForm: OFormComponent;
  @ViewChild('nameInput') public userCtrl: OTextInputComponent;
  @ViewChild('emailInput') public emailCtrl: OEmailInputComponent;
  @ViewChild('passInput') public pwdCtrl: OPasswordInputComponent;
  @ViewChild('submitButton') public submitButton: OButtonComponent;
  @ViewChild('companyInput') public companyInput: OTextInputComponent;
  @ViewChild('checkBoxCompany') public checkBoxCompany: OCheckboxComponent;

  protected service: OntimizeService;
  private redirect = '/main';
  onCompanyCheckChange: any;

  constructor(protected injector: Injector,
    @Inject(AuthService) private authService: AuthService,
    private router: Router) {
    this.service = this.injector.get(OntimizeService);
    this.configureService()
  }

  protected configureService() {
    const conf = this.service.getDefaultServiceConfiguration('users');
    this.service.configureService(conf);
  }

  checkEmail() {
    const email = this.emailCtrl.getValue();
    if (email && email.length > 0) {
      const filter = { 'usr_email': email };
      const columns = ['usr_id'];
      this.service.query(filter, columns, 'user').subscribe(resp => {
        if (resp.data && resp.data.length > 0) {
          alert('Email ya existe')
          this.emailCtrl.setValue('');
        }
      });
    }
  }

  checkUserName() {
    const user = this.userCtrl.getValue();
    if (user && user.length > 0) {
      const filter = { 'usr_login': user };
      const columns = ['usr_id'];
      this.service.query(filter, columns, 'user').subscribe(resp => {
        if (resp.data && resp.data.length > 0) {
          alert('Usuario ya existe')
          this.userCtrl.setValue('');
        }
      });
    }
  }

  disableButton() {
    this.submitButton.enabled = false
  }

  logUser(userName,password) {
    const self = this;
    this.authService.login(userName, password)
      .subscribe(() => {
        self.router.navigate([this.redirect]);
      });
  }

  checkCompany() {
    return this.checkBoxCompany ? this.checkBoxCompany.getValue() : false;
  }

  goBack() {
    this.router.navigate(["/login"])
  }

  validateCIF(cif: string): boolean {
    if (cif.length !== 9) return false;
  
    const letraInicial = cif[0].toUpperCase();
    const numero = cif.substring(1, 8);
    const digitoControl = cif[8];
  
    // Suma de los dígitos pares
    let totalPares = 0;
    for (let i = 1; i < numero.length; i += 2) {
      totalPares += parseInt(numero[i], 10);
    }
  
    // Suma de los dígitos impares multiplicados por 2
    let totalImpares = 0;
    for (let i = 0; i < numero.length; i += 2) {
      let impar = parseInt(numero[i], 10) * 2;
      totalImpares += Math.floor(impar / 10) + (impar % 10);
    }
  
    // Suma total
    const total = totalPares + totalImpares;
    const unidades = total % 10;
    const digitoCalculado = (unidades === 0) ? 0 : 10 - unidades;
  
    // Determinación del carácter de control esperado
    const caracteresControl = "JABCDEFGHI";
    let caracterEsperado = "";
  
    if (letraInicial === 'X' || letraInicial === 'Y' || letraInicial === 'Z') {
      caracterEsperado = caracteresControl[digitoCalculado];
    } else if ('ABEH'.includes(letraInicial)) {
      caracterEsperado = digitoCalculado.toString();
    } else {
      caracterEsperado = caracteresControl[digitoCalculado];
    }
  
    // Comprobación del carácter de control
    return caracterEsperado === digitoControl;
  }
  

  checkCif(){
    const cif = this.companyInput.getValue();

    if (!this.validateCIF(cif)) {
      alert('CIF no válido');
      this.companyInput.setValue('');
    }
    if (cif.length > 0) {
      const filter = { 'usr_cif': cif};
      const columns = ['usr_id'];
      this.service.query(filter, columns, 'user').subscribe(resp => {
        if (resp.data && resp.data.length > 0) {
          alert('CIF ya existe')
          this.companyInput.setValue('');
        }
      });
    }

  }

  insertUser() {
    const userName = this.userCtrl.getValue();
    const email = this.emailCtrl.getValue();
    const password = this.pwdCtrl.getValue();
    let  cif = "0";
    let checkBoxCompany = "false";

    if(this.checkCompany()){
      cif = this.companyInput.getValue();
      checkBoxCompany = "true";
    }

    // Validaciones antes de la inserción
    if (!userName || !email || !password || (this.checkCompany() && !this.validateCIF(cif))) {
      alert('Todos los campos son obligatorios y el CIF debe ser válido si la empresa está marcada.');
      return;
    }
   // Verificar que el CIF es obligatorio si la empresa está marcada
      if (this.checkCompany() && (!cif || !this.validateCIF(cif))) {
        alert('El CIF es obligatorio y debe ser válido si la empresa está marcada.');
        return;
      }
    // Datos del usuario para insertar
    const userData = {
      'usr_login': userName,
      'usr_email': email,
      'usr_password': password,
      'usr_cif': cif,
      'companyCheck': checkBoxCompany
    };
  
    this.service.insert(userData, 'user').subscribe(resp => {
      if (resp.code === 0) {
        this.registerForm.setFormMode(1);
        this.logUser(userName,password);
      } else {
        alert('Error al registrar usuario');
      }
    }, error => {
      console.error('Error al insertar el usuario', error);
      alert('Error en la inserción');
    });
  }
  }



