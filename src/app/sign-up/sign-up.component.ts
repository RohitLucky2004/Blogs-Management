import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {Location} from '@angular/common'

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
  constructor(public service:AppService,public router:Router, private location:Location){}
  signUpForm=new FormGroup({
    nickname:new FormControl('',Validators.required,),
    username:new FormControl('',[Validators.required,Validators.minLength(4)]),
    email:new FormControl('',[Validators.required,Validators.email]),
    password:new FormControl('',Validators.required),
    cpassword:new FormControl('',Validators.required)
  })
  userdetails={
    username:'',
    nickname:'',
    email:'',
    created:'',
    lastUpdate:''
  }
ngOnInit(){
  if(this.router.url!='/signUp')
{var username:any=sessionStorage.getItem('username')
  this.service.getUserDetails(username).subscribe({next:(res:any)=>{
  this.userdetails.username=res.username;
  this.userdetails.nickname=res.nickname;
  this.userdetails.email=res.email;
  this.userdetails.created=res.createdAt;
  this.userdetails.lastUpdate=res.updatedAt;
  // console.log(res);
}}
  );}
}
updateForm(){
  // console.log("form:",this.signUpForm.value);
  var data={
    "nickname":this.signUpForm.value.nickname,
    "username":this.signUpForm.value.username,
    "password":this.signUpForm.value.password,
    "email":this.signUpForm.value.email
  }
 this.service.updateUserDetails(data)
}


async signUpSubmit(){
  // console.log("form:",this.signUpForm.value);
  const data={
    "nickname":this.signUpForm.value.nickname,
    "username":this.signUpForm.value.username,
    "password":this.signUpForm.value.password,
    "email":this.signUpForm.value.email
  }
  const toNav2Login=await this.service.newUser(data);
  if(toNav2Login)this.router.navigate(['login']);
}

pswdalert=false

checkConfrimPassword(event:Event){
  this.pswdalert=true;  
  if(this.signUpForm.value.password==this.signUpForm.value.cpassword){
    this.pswdalert=false;
  }
}
navlogin(){
  this.router.navigate(['/login'])
}

usernameDefect = false;
  passwordDefect = false;

  checkUsername(event: Event) {
    this.usernameDefect = false;
    const usern: string | undefined | null = this.signUpForm.value.username;
    if (usern && usern.length <4) {
      this.usernameDefect = true;
    }
  }
  msg = "";

  checkPassword() {
    this.passwordDefect = false;
    const paswd: string | null = this.signUpForm.value.password ?? null;
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
      }
      else if (!LC) {
        this.passwordDefect = true;
        this.msg = "password must contain atleast one Lower Case Character";
      }
      else if (!NC) {
        this.passwordDefect = true;
        this.msg = "password must contain atleast one numeric Character";
      }
      else if (!SC) {
        this.passwordDefect = true;
        this.msg = "password must contain atleast one special Character[!@#$%^&*(),.?\":{}|<>]";
      }
    }
  }

  nameDefect=false;
  nameCheck(){
    if(this.signUpForm.value.nickname==null){
      this.nameDefect=true;
    }
  }
  hide = true;

  view() {
    this.hide = !this.hide;
  }
  hide1 = true;

  view1() {
    this.hide1 = !this.hide1;
  }
  goback(){
    this.location.back()
  }
  emailCheck(){
    const email=this.signUpForm.value.email??"";
    var emaildefect=/[A-Z]/.test(email)
  }
}
