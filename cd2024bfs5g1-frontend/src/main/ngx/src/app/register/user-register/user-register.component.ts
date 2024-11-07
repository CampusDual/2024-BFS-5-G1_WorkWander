import { AfterViewInit, Component, Inject, Injector, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, OButtonComponent, OCheckboxComponent, OEmailInputComponent, OFormComponent, OntimizeService, OPasswordInputComponent, OTextInputComponent, OSnackBarConfig, SnackBarService } from 'ontimize-web-ngx';
import { MatSnackBar, } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})


export class UserRegisterComponent implements AfterViewInit{

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
    private router: Router, protected snackBarService: SnackBarService) {
    this.service = this.injector.get(OntimizeService);
    this.configureService()
  }

  protected configureService() {
    const conf = this.service.getDefaultServiceConfiguration('users');
    this.service.configureService(conf);
  }

  validateEmail(email: string): boolean {
    if (!email) return false;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(email);

    if (!isValid) {
      this.showConfigured('El correo electrónico contiene caracteres no permitidos.');
    }

    return isValid;
  }
  validateUserName(userName: string): boolean {
    if (!userName) return false;

    const userNameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
    const isValid = userNameRegex.test(userName);

    if (!isValid) {
      this.showConfigured('El nombre de usuario solo puede contener letras, números, puntos, guiones y debe tener entre 3 y 20 caracteres.');
    }

    return isValid;
  }
  checkEmail() {
    const email = this.emailCtrl.getValue();
    if (!this.validateEmail(email)) {
      this.emailCtrl.setValue('');
      return;
    }

    const filter = { 'usr_email': email };
    const columns = ['usr_id'];
    this.service.query(filter, columns, 'user').subscribe(resp => {
      if (resp.data && resp.data.length > 0) {
        this.showConfigured('Email ya existe');
        this.emailCtrl.setValue('');
      }
    });
  }
  checkUserName() {
    const user = this.userCtrl.getValue();
    if (!this.validateUserName(user)) {
      this.userCtrl.setValue('');
      return;
    }

    const filter = { 'usr_login': user };
    const columns = ['usr_id'];
    this.service.query(filter, columns, 'user').subscribe(resp => {
      if (resp.data && resp.data.length > 0) {
        this.showConfigured('Usuario ya existe');
        this.userCtrl.setValue('');
      }
    });
  }

  checkPassword(){
    const password = this.pwdCtrl.getValue();
    if (password.length <= 8){
      this.showConfigured('Longitud de la contraseña debe ser mayor de 8 caracteres.');
      this.pwdCtrl.setValue('');
    }
    if (password.length >= 16){
      this.showConfigured('Longitud de la contraseña debe ser menor de 16 caracteres.');
      this.pwdCtrl.setValue('');
    }
  }
  showSimple() {
    this.snackBarService.open('Snackbar message');
    };
    showConfigured(message: string) {
      // SnackBar configuration
      const configuration: OSnackBarConfig = {
          action: 'Done',
          milliseconds: 5000,
          icon: 'check_circle',
          iconPosition: 'left'
      };
      this.snackBarService.open('Snackbar text', configuration);
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

  showCIF() {
    return this.checkBoxCompany ? !this.checkBoxCompany.getValue() : true;
  }

  goBack() {
    this.router.navigate(["/login"])
  }

  //Link para generar CIFs
  //https://testingdatagenerator.com/doi.html
  validateCIF(cif: string): boolean {
    if(!cif) return false;
    if (cif.length !== 9) return false;

    const letraInicial = cif[0].toUpperCase();
    const numero = cif.substring(1, 8);
    const digitoControl = cif[8];

    let totalPares = 0;
    for (let i = 1; i < numero.length; i += 2) {
      totalPares += parseInt(numero[i], 10);
    }

    let totalImpares = 0;
    for (let i = 0; i < numero.length; i += 2) {
      let impar = parseInt(numero[i], 10) * 2;
      totalImpares += Math.floor(impar / 10) + (impar % 10);
    }

    const total = totalPares + totalImpares;
    const unidades = total % 10;
    const digitoCalculado = (unidades === 0) ? 0 : 10 - unidades;

    // Tabla de letras para el control alfabético
    const caracteresControl = "JABCDEFGHI";
    let caracterEsperado: string;

    // Letras iniciales específicas para control numérico
    if ('ABEH'.includes(letraInicial)) {
      caracterEsperado = digitoCalculado.toString();
    } else if ('NPSU'.includes(letraInicial)) {
      // Letras para control alfabético y otras entidades como UTEs
      caracterEsperado = caracteresControl[digitoCalculado];
    } else {
      // Si no es un caso específico, asumimos que puede ser numérico o alfabético
      caracterEsperado = caracteresControl[digitoCalculado];
    }

    // Comprobación final del carácter de control (puede ser numérico o alfabético según la letra inicial)
    return caracterEsperado === digitoControl || digitoCalculado.toString() === digitoControl;
  }

  checkCif(){
    let cif = this.companyInput.getValue();
    if(!cif) return;
    if (!this.validateCIF(cif)) {
      this.showConfigured('CIF no válido');
      this.companyInput.setValue('');
      return
    }
      const filter = { 'usr_cif': cif};
      const columns = ['usr_id'];
      this.service.query(filter, columns, 'user').subscribe(resp => {
        if (resp.data && resp.data.length > 0) {
          this.showConfigured('CIF ya existe')
          this.companyInput.setValue('');
          return
        }
      });
  }

  insertUser() {
    const userName = this.userCtrl.getValue();
    const email = this.emailCtrl.getValue();
    const password = this.pwdCtrl.getValue();
    let  cif = null;
    let checkBoxCompany = "false";

    if(this.checkCompany()){
      cif = this.companyInput.getValue();
      checkBoxCompany = "true";
    }

    // Validaciones antes de la inserción
    if (!userName || !email || !password || (this.checkCompany() && !cif)) {
      this.showConfigured('Todos los campos son obligatorios.');
      return;
    }

    //Verificar que la contraseña tiene entre 8 y 16 caracteres
    if (password.length < 8){
      this.showConfigured('La contraseña tiene que contener como mínimo 8 caracteres.');
      return;
    }
    if (password.length > 16){
      this.showConfigured('La contraseña tiene que contener como máximo 16 caracteres.');
      return;
    }
    // Verificar que el CIF es obligatorio si la empresa está marcada
      if (this.checkCompany() && !this.validateCIF(cif)) {
        this.showConfigured('El CIF es obligatorio y debe ser válido si la empresa está marcada.');
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
        this.showConfigured('Error al registrar usuario');
      }
    }, error => {
      console.error('Error al insertar el usuario', error);
      this.showConfigured('Error en la inserción');
    });
  }

  ngAfterViewInit(): void {
    this.setupVideoPlayback();
  }

  setupVideoPlayback(): void {
    const videoElement = document.getElementById('background-video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.muted = true; // Asegúrate de que el video esté silenciado
      videoElement.currentTime = 0; // Reinicia el video
      videoElement.play().catch(error => {
        console.log('Video playback failed:', error);
      });

      document.addEventListener('click', () => {
        videoElement.play().catch(error => {
          console.log('Video playback failed:', error);
        });
      }, { once: true });
    }
  }


}



