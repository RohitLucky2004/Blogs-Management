import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogComponent } from '../blog/blog.component';
import { ToastrService } from 'ngx-toastr';
import { CustomPipe } from '../../custom.pipe';
import {MatDialog} from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, BlogComponent,CustomPipe],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.css'
})
export class BlogListComponent implements OnInit {
  username: string | any;
  page = 1;
  limit = 6;
  selected: number = 0;
  tags: any;
  blogs:any|{
    _id: '',
    username: '',
    title: '',
    comments: [],
    likes:[],
    description: [],
    categories: [],
    files:[]
  }=[];
  selectedFilter: string = "2";
  mode:string="all";
  query:{
    'field': object;
    'order': 1 | -1;
    'page':number;
    'limit':6
  } | any;
  hrs:any;
  search: string = '';
  NoMore=false;
  user:any
isliked:{[key:string]:boolean}={}
  imgURL = 'data:image/png;base64,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';
isRecoverable:boolean=false;
  constructor(private service: AppService, private toastr: ToastrService, public router: Router,private dialog:MatDialog) { }
nicknames:any=[];
  ngOnInit() {
    this.username = sessionStorage.getItem('username');
    this.user=sessionStorage.getItem('username')
    if(this.router.url == '/home/profile'){
      this.mode='one'
    }
    else if (this.router.url == '/home/publisher/profile') {
      this.mode="one"
      this.username=sessionStorage.getItem('publisherProfile')
      console.log(this.username); 
    }
    
    this.loadBlogs(this.page,this.selectedFilter,this.mode)
    this.service.getNicknames().subscribe((res:any)=>{
      this.nicknames=res
    })
  }
toggleRecoverable(){
  this.isRecoverable=!this.isRecoverable;
// console.log(this.isRecoverable);
this.loadBlogs(this.page,this.selectedFilter,this.mode);

}
 async loadBlogs(pg:number,sort: string,mode:string) {
    this.page=pg;
    this.selectedFilter = sort;
    switch (this.selectedFilter) {
      case "3":
        if(mode=="all")
        this.query={'find':`{"isDeleted":"${this.isRecoverable}"}`,'sort':'{"likesCount":-1}',"skip":this.page,"limit":6}
        else
          this.query={'find':`{"username":"${this.username}","isDeleted":"${this.isRecoverable}"}`,'sort':'{"likesCount":-1}',"skip":this.page,"limit":6}
        break;
      default:
        if(mode=="all")
          this.query={'find':`{"isDeleted":"${this.isRecoverable}"}`,'sort':'{"createdAt" : -1}',"skip":this.page,"limit":6}
        else
          this.query={'find':`{"username":"${this.username}","isDeleted":"${this.isRecoverable}"}`,'sort':'{"createdAt" : -1}',"skip":this.page,"limit":6}
    }
    //  console.log(this.query);
    this.commonload()
  }
  commonload(){
    console.log(this.query);
    this.service.commonload(this.query).subscribe((res:any)=>{
      console.log(res);
       this.blogs = res.blog;
             this.NoMore=res.noMore
       this.checkLikes()
     })
  }

  getImage(files:any){
    if(files.length>0){
      const file=files[0]
      // console.log(file);
    return `data:${file.MIMEtype};base64,${file.data}`;}
    return `data:image/png;base64,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`
  }

  openBlog(blog:any) {
    // console.log("---",blog);
    if(blog.isDeleted=='true')return ;
    // console.log("hhikhihihihi"); 
sessionStorage.setItem('blogId',blog._id)
this.router.navigate(['home/blogView'])
  }

 checkLikes(){
  for(let blog of this.blogs){
    if(blog.likes.includes(this.username)){
      this.isliked[blog._id]=true;
    }
    else{
      this.isliked[blog._id]=false;
    }
  }
  // console.log(this.isliked);
 }
  like(blog:any) {
   if(blog.isDeleted=='true')return 
    this.service.like(blog._id, this.username).subscribe((res:any)=>{
     if(res)this.isliked[blog._id]=!this.isliked[blog._id]
     this.loadBlogs(this.page,this.selectedFilter,this.mode)
    //  console.log(res,this.isliked);
     
    })
  }

  onSortChange(event: Event) {
    const selected = (event.target as HTMLSelectElement).value;
    switch (selected) {
      case "3": //likes
        this.selectedFilter="3"
        this.loadBlogs(this.page,this.selectedFilter,this.mode)
        break;
        default: //latest first
        this.selectedFilter="2"
        this.loadBlogs(this.page,this.selectedFilter,this.mode)
        break;
    }
  }

  onBlogsChange(event: Event) {
    const selected = (event.target as HTMLSelectElement).value;
    switch (selected) {
      case "3": //my blogs in latest first
        this.mode="one";
        this.page=1;
        this.loadBlogs(this.page,this.selectedFilter,this.mode)
        break;
      default:
        this.mode="all"
        this.loadBlogs(this.page,this.selectedFilter,this.mode)
        break;
    }
  }

  onSearch(text:string) { 
    if(text==''){
      this.commonload()
    }
    else{
     let usersBlogs=sessionStorage.getItem('publisherProfile')??'^^&&^';
     console.log(usersBlogs);   
    this.service.search(text,usersBlogs).subscribe((res:any)=>{
      console.log(res);
      this.blogs=res.blog
      this.NoMore=res.noMore
    })}
  };

  blogEdit(id: string, createdAt: any) {
      sessionStorage.setItem('editBlog',id)
      this.router.navigate(['/home/profile/myblogs/blogEdit'])
  }

  deletionBlog(blogId:string){
    const dialogRef=this.dialog.open(DialogComponent,{
      width:'400px',
      data:{title:"Delete",message:"are you sure you want to delete?"}
    });
    dialogRef.afterClosed().subscribe((r:any)=>{
      console.log("dialog-",r);
      if(r){
        this.service.deletionBlog(blogId).subscribe((res: any)=>{
          if(res){
            this.toastr.success("blog stored in Recoverable State ")
            this.loadBlogs(this.page,this.selectedFilter,this.mode)
          }
          else{
            this.toastr.error("deletion failed")
          }
        })
      }
      else{
        return ;
      }
    })
  }

  permanantDelete(blogId:string){
    const dialogRef=this.dialog.open(DialogComponent,{
      width:'400px',
      data:{title:"Delete",message:"are you sure you want to delete permanently?"}
    });
    dialogRef.afterClosed().subscribe((r:any)=>{
      console.log("dialog-",r);
      if(r)
this.service.PermanantDelete(blogId).subscribe((res:any)=>{
  if(res)this.toastr.success("Permanantly deleted")
  else this.toastr.error("try again")
  this.loadBlogs(this.page,this.selectedFilter,this.mode)
})
  })}
  
  checkEditValidity(createdAtTime:any){
    const createdAtTimer = new Date(createdAtTime);
    const currentDate = new Date();
    const diffInMS = currentDate.getTime() - createdAtTimer.getTime();
    const hrs = Math.floor(diffInMS / (1000 * 60 * 60))
    if(hrs<24)return true;
    else return false;
  }
  checkTime(creation:string,updation:string){
    const created=new Date(creation);
const updated=new Date(updation)
const diff=updated.getTime()-created.getTime()
if(diff<3)return false
return true
  }

  openProfile(blog:any){
    if(blog.isDeleted=='true')return ;
    sessionStorage.setItem('publisherProfile',blog.username)
    this.router.navigate(['/home/publisher/profile'])
  }
}