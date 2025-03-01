import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { query } from 'express';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  api = 'http://192.168.144.220:3000';
  constructor(private http: HttpClient, private router: Router,private toastr:ToastrService) { }

  login(username: any, password: any) {
    const data = { 'username': username, 'password': password };
    console.log("service: details:", { 'username': username, 'password': password });
    return this.http.post<{ token: string,username:string,userId:string }>(`${this.api}/user/login`, data)// data is the object with contains the username, pswd
  }

  getTags() {
    return this.http.get<string[]>(`${this.api}/blog/getTags`)
  }

  async newUser(data: any) {
    console.log(data);
    var bool:any=false;
    this.http.post(`${this.api}/user/signUp`, data).subscribe({next:async (res)=>{
            bool=res;
            if(res){
              this.toastr.success("saved Successfully");
            }
            else{
              this.toastr.error("username already exist, saving failed");
            }
            this.router.navigateByUrl('/')
    }})
    return bool;
  }

  sendBlog(blogObj: Object) {
    return this.http.post(`${this.api}/blog/createBlog`, blogObj).subscribe((res) => {
      this.toastr.success("form submitted");
      this.router.navigate(['/home'])
    }
    );
  }

  getUserDetails(username:string){
    const headers= new HttpHeaders({
      Authorization:`Bearer ${sessionStorage.getItem('Token')}`,
    })
    console.log(username);
    
    return this.http.get(`${this.api}/user/profile/${username}`,);
  }
  
  updateUserDetails(data:any){
    const headers= new HttpHeaders({
      Authorization:`Bearer ${sessionStorage.getItem('Token')}`,
    })
    return this.http.put(`${this.api}/user/update`,data,{headers}).subscribe((res:any)=>{
      if(res){
        this.toastr.success("updation successful");
        this.router.navigate(['home/profile'])
      }
    })
  }

  commonload(quer:object|any){
    // console.log(quer);
    return this.http.get(`${this.api}/blog/commonLoad`,{'params':quer})
  }

  like(id:string,username:string){
    const payload = {'id':id,'username':username};
    console.log(payload);
    return this.http.patch(`${this.api}/blog/Bloglike`,payload);
  }

  findBlog(id:string){
    return this.http.get(`${this.api}/blog/find/${id}`)
  }

  BlogUpdation(blog:any,id:string){
    return this.http.patch(`${this.api}/blog/updateBlog/${id}`,blog)
  }

  deletionBlog(blogId:string){
    return this.http.delete(`${this.api}/blog/recovery/${blogId}`);
  }
  PermanantDelete(blogId:string){  
    return this.http.delete(`${this.api}/blog/deleteBlog/${blogId}`)
  }

  getNicknames(){
    return this.http.get<[{username:string,nickname:string}]>(`${this.api}/user/nicknames`);
  }

  getComments(blogId:string,page:number,limit:number){
    return this.http.get(`${this.api}/blog/getComments/${blogId}/${page}/${limit}`)
  }

  addComment(blogId:string,comment:string){
   const  cmt={'comment':comment}
    return this.http.post(`${this.api}/blog/comment/${blogId}`,cmt)
  }

  commentLike(blogId:string,commentId:string){
    return this.http.get(`${this.api}/blog/commentLike/${blogId}/${commentId}`)
    
  }
  tagComment(blogId:string,comment:string,tagId:string){
   const commentObj={'comment':comment}
    return this.http.post(`${this.api}/blog/subComment/${blogId}/${tagId}`,commentObj)
  }
  updateComment(commentId:string,comment:string,blogIdd:string){
    const commentObj={'comment':comment}
    return this.http.patch(`${this.api}/blog/updateComment/${blogIdd}/${commentId}`,commentObj)
  }
  getReplies(blogId:string,comment_id:string){
    return this.http.get(`${this.api}/blog/replies/${blogId}/${comment_id}`)
  }
  search(query:any,username:string){
        return this.http.post(`${this.api}/blog/search`,{'text':query,'username':username})
  }
}