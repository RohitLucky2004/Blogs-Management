import { Component, OnInit, DoCheck } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppService } from '../app.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements DoCheck, OnInit{
  constructor(public service: AppService, public router: Router, private toastr: ToastrService) { }
  wrongCredentials = false;
  loginVisible = true;
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  ngOnInit(){
if(sessionStorage.getItem('Token')){
    this.router.navigate(['/home'])
}
  }
  submitted() {
    this.service.login(this.loginForm.value.username, this.loginForm.value.password).subscribe((res:any) => {
      // console.log("res:",res);
      if(res){
        sessionStorage.setItem('Token',res.token);
        sessionStorage.setItem('username',res.username);
        sessionStorage.setItem('userId',res.userId);
      }
      if(sessionStorage.getItem('Token')){
      this.toastr.success('Login Successful')
      this.router.navigate(['home/'])}
      else{
        this.toastr.error('Invalid Credentials')
      }
    })
  }

  signUp() {
    this.router.navigate(['signUp'])
  }
  usernameDefect = false;
  passwordDefect = false;

  checkUsername(event: Event) {
    this.usernameDefect = false;
    const usern: string | undefined | null = this.loginForm.value.username;
    if (usern && usern.length < 6) {
      this.usernameDefect = true;
    }
  }
  msg = "";

  checkPassword() {
    this.passwordDefect = false;
    const paswd: string | null = this.loginForm.value.password ?? null;
    if (paswd == null) {
      this.passwordDefect = true;
      this.msg = "password is required";
    }
    else if (paswd.length < 8) {
      this.passwordDefect = true;
      this.msg = "password contain atleast 8 characters";
    }
    else {
      const UC = /[A-Z]/.test(paswd);
      const LC = /[a-z]/.test(paswd);
      const NC = /\d/.test(paswd);
      const SC = /[!@#$%^&*(),.?":{}|<>]/.test(paswd);
      if (!UC) {
        this.passwordDefect = true;
        this.msg = "password must contain atleast one Upper Case Character";
        return;
      }
      else if (!LC) {
        this.passwordDefect = true;
        this.msg = "password must contain atleast one Lower Case Character";
        return;
      }
      else if (!NC) {
        this.passwordDefect = true;
        this.msg = "password must contain atleast one numeric Character";
        return;
      }
      else if (!SC) {
        this.passwordDefect = true;
        this.msg = "password must contain atleast one special Character[!@#$%^&*(),.?\":{}|<>]";
      }
      return;
    }
  }
  hide = true;

  view() {
    this.hide = !this.hide;
  }
submitButton=false;
ngDoCheck() {
    this.submitButton= !this.passwordDefect && !this.loginForm.invalid;
    this.submitButton=!this.submitButton;
  }
}