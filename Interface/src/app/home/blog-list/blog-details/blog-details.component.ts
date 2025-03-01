import { Component, OnInit, ElementRef, ViewChild, Input, } from '@angular/core';
import { AppService } from '../../../app.service';
import { CommonModule, Location } from '@angular/common';
import { CommentsComponent } from '../comments/comments.component';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, CommentsComponent ],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.css'
})
export class BlogDetailsComponent implements OnInit{
  page: number=1;
  limit: number=5;
  isSeeMore: boolean=false;

  constructor(private router:Router, private service:AppService, private location:Location, private toastr:ToastrService){}

  id:string|any=sessionStorage.getItem('blogId');
  blog:any;
  userdetails:any={
    username:'',
    nickname:''
  };
  username:string|any=sessionStorage.getItem('username')
  comments:any=[];

  ngOnInit(): void {
    this.id=sessionStorage.getItem('blogId');  
    this.getComments()
    this.service.findBlog(this.id).subscribe((res:any)=>{
    this.blog=res;
    console.log("blog:",this.blog);
      this.getNickname(this.blog.username)
   })
  }
  getNickname(username:String){
    this.service.getUserDetails(this.blog.username).subscribe({next:(res:any)=>{
      this.userdetails.username=res.username;
      this.userdetails.nickname=res.nickname;
    }});
  }

  goBack(){
    this.location.back()
    sessionStorage.removeItem('blogId')
    }
    
  like() {
    this.service.like(this.id, this.username).subscribe({
      next: (res:any) => {
        this.service.findBlog(this.id).subscribe((res:any)=>{
          this.blog=res;
         })
      },
    })
  }
  @ViewChild('NC',{static:true})Nc!:ElementRef;
  async addComment(){
    const newComment=this.Nc.nativeElement.value.trim()
   if(newComment){
    await this.service.addComment(this.id,newComment).subscribe(async(res:any)=>{
       this.refreshComments()
       if(res){this.toastr.success("comment added")
    }
    else{
      this.toastr.error("try after some time")
    }
     })
   }
  }
  refreshComments(){
    const limite=(this.comments.length>5)?this.comments.length:5
    this.service.getComments(this.id,1,limite).subscribe((res:any)=>{
      // console.log("res",res);
      this.comments=res
      if( this.comments.length==5){
        this.isSeeMore=true}
    })
  }
  getImage(file:any){
    return `data:${file.MIMEtype};base64,${file.data}`;
  }
  getComments(){
    this.service.getComments(this.id,this.page,this.limit).subscribe((res:any)=>{
      // console.log("res",res);
      this.comments=this.comments.concat(res)
      if(res.length==this.limit){
        this.isSeeMore=true
       this.page+=1}
       else{
         this.isSeeMore=false
       }
    })
  }
  openProfile(username:string){
    sessionStorage.setItem('publisherProfile',username)
    this.router.navigate(['/home/publisher/profile'])
  }
}
