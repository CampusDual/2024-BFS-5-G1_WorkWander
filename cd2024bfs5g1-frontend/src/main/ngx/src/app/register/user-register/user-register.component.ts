import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})

export class UserRegisterComponent implements OnInit{
  
  public registerForm: UntypedFormGroup = new UntypedFormGroup({});
  public userCtrl: UntypedFormControl = new UntypedFormControl('', Validators.required);
  public pwdCtrl: UntypedFormControl = new UntypedFormControl('', Validators.required);
  public emailCtrl: UntypedFormControl = new UntypedFormControl('', Validators.required);
  
  ngOnInit(): void {

    this.registerForm.addControl('username', this.userCtrl);
    this.registerForm.addControl('password', this.pwdCtrl);
    this.registerForm.addControl('email', this.emailCtrl);

  }
  
  register() {
    const userName = this.registerForm.value.username;
    const password = this.registerForm.value.password;
    const email = this.registerForm.value.email;
    
    if (userName && userName.length > 0 && password && password.length > 0 && email && email.length > 0) {
      
      const self = this;
      
    }
    else{

      console.error('Must fill user, password and email.');

    }
  }
  


}
