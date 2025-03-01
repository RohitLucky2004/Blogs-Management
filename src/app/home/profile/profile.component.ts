import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import{Location, CommonModule} from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BlogListComponent } from '../blog-list/blog-list.component';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,BlogListComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  constructor(private service:AppService,public router:Router,private location:Location,private title:Title){}
  data:any;
  user:any;
  userdetails={
    username:'',
    nickname:'',
    email:'',
    createdAt:'',
    updatedAt:'',
    BlogsCount:''
  }
  Blogs:object[] | undefined;
  username:string|any
ngOnInit(){
  this.user=sessionStorage.getItem('username')
  // console.log(this.title.getTitle());
  if(this.router.url=='/home/publisher/profile'){
   this.username=sessionStorage.getItem('publisherProfile')}
   else{
     this.username=sessionStorage.getItem('username')
   }
this.service.getUserDetails(this.username).subscribe({next:(res:any)=>{
  this.userdetails.username=res.username;
  this.userdetails.nickname=res.nickname;
  this.userdetails.email=res.email;
  this.userdetails.createdAt=res.createdAt;
  this.userdetails.updatedAt=res.updatedAt;
  this.userdetails.BlogsCount=res.Blogs.length;
  this.Blogs=res.Blogs;
  console.log(res,this.Blogs);
}});
}
edit(){
  this.router.navigate(['home/profile/update'])
   }
   goBack(){
    this.location.back()
    }
}
