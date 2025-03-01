import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser'
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../app.service';
import {v4 as uuidv4} from 'uuid';
import { DialogComponent } from '../../dialog/dialog.component';
import {  MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit {

  exitsingTags: string[] = [];
  selectedTags: string[] = [];
  visible = false;
  addDesc:boolean=true;
  formated=false
  showEAD:{ [key: string]: boolean }={}
  edit:{ [key: string]: boolean }={}
  descriptions:any=[]
  constructor(private service: AppService, private toastr: ToastrService, 
    public router: Router, public title: Title, private location: Location
    , private dialog:MatDialog) { }
  form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(['']),
    category: new FormControl(['']),
    newtag: new FormControl(''),
  })
  blog_id: string|any = '';
  ngOnInit(): void {
    this.service.getTags().subscribe((tag: string[]) => {
      this.exitsingTags = tag.concat(['programming', 'framework', 'others'])
      // console.log(this.exitsingTags);
    });
    if (this.title.getTitle() == "Edit Blog") {
      this.blog_id=sessionStorage.getItem('editBlog')
      this.getBlogDetails(this.blog_id)
    }
  }
  isFormValid:any=true
  addNewDesc(content:string){
    var desc={
      "textId":"",
      "content":"",
      "formated":false
    }
    desc.textId=uuidv4();
    desc.content=content;
    desc.formated=this.formated;
    this.descriptions.push(desc)
    console.log(this.descriptions);
    this.isFormValid=!(this.form.get('title')?.touched && this.descriptions.length>0)

  }
  updateDesc(content:string,textId:string){
    content=content.trim()
    if(content==""){
      this.descriptions=this.descriptions.filter((item:any)=>item.textId!==textId)
    }
    else{
      const index=this.descriptions.findIndex((item:any)=>item.textId==textId)
      console.log(index);
      var desc=this.descriptions[index]
      desc.content=content
      this.descriptions[index]=desc
    }
    console.log(this.descriptions);
    this.edit[textId]=false
  }
  changeFormate(){
    this.formated=!this.formated
  }
  tagCancel() {
    this.visible = false;
  }
  addTag(event: Event) {
    this.visible = false
    if (this.form.value.newtag === "others"  ) {
      this.form.value.newtag = ""
      this.visible = true;
    } 
    else {
      var tag: any;
      tag = this.form.value.newtag;
      if (!this.selectedTags.includes(tag)) this.selectedTags.push(tag);
    }
  }

  addNewTag(tag: string) {
    if (!this.selectedTags.includes(tag) && tag != "" && !this.exitsingTags.includes(tag)) this.selectedTags.push(tag);
  }

  removeTag(tag: string) {
    if (this.selectedTags.includes(tag)) {
      const index = this.selectedTags.indexOf(tag);
      this.selectedTags.splice(index, 1)
      this.form.patchValue({ category: this.selectedTags });
    }
  }

  goBack() {
    const dialogRef=this.dialog.open(DialogComponent,{
      width:'400px',
      data:{title:"Cancel",message:"are you sure you want to leave without saving?"}
    });
    dialogRef.afterClosed().subscribe((r:any)=>{
      console.log("dialog-",r);
      if(r){
    this.location.back();
    sessionStorage.removeItem('editBlog')
  }})}
  EditDesc(id:string){
    this.edit[id]=true
    console.log(this.edit);
  }

  onSubmit() {
    this.form.patchValue({ category: this.selectedTags })
    var blogObj = this.form.value;
    blogObj.description=this.descriptions
    this.service.sendBlog(blogObj)
  }
  // -------------------------------------------edit blog---------------------------------------------------------------------------

  blogDetails: any = {
    "category": [],
    "comments": [],
    "createdAt": "",
    "description": "",
    "likes": [],
    "title": "",
    "updatedAt": "",
    "username": "",
    "__v": 0,
    "_id": ""
  }
  getBlogDetails(id: string) {
    this.service.findBlog(id).subscribe((res: any) => {
      // console.log(res);
      this.blogDetails = res;
      this.selectedTags = this.blogDetails.category??null;
      this.descriptions=this.blogDetails.description
    })
  }

  blogUpdation() {
    const updatedblog = {
      "title": this.form.value.title || this.blogDetails.title,
      "description": this.descriptions,
      "category": this.selectedTags
    }
    this.service.BlogUpdation(updatedblog, this.blogDetails._id).subscribe((res: any) => {
      if (res) {
        this.toastr.success("changes saved");
        this.location.back()
      }
      else {
        this.toastr.error("try after some time");
      }
    })
  }
}
