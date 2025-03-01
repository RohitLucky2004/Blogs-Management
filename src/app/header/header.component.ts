import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import{DialogComponent} from '../dialog/dialog.component';
import {MatDialog} from '@angular/material/dialog';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  createButtonVisible = true;
  username = sessionStorage.getItem('username')
  constructor(public router: Router, private location: Location,private dialog:MatDialog) { }
  createBlog() {
    this.router.navigate(['home/blog'])
  }
  profile() {
    this.router.navigate(['home/profile']);
  }
  goBack() {
    this.location.back()
  }

  logout() {
    const dialogRef=this.dialog.open(DialogComponent,{
      width:'400px',
      data:{title:"logout",message:"are you sure you want to logout?"}

    });
    dialogRef.afterClosed().subscribe((r:any)=>{
      console.log("dialog-",r);
      if(r){
        sessionStorage.clear()
        this.router.navigate(['/'])
      }
    })
    
  }
  profileee = ''
  options = [{
    value: '1', label: 'profile'
  },
  { value: '2', label: 'logout' }]
  callFunction(event: Event) {
    const selected = (event.target as HTMLSelectElement).value;
    if (selected == '1') this.profile();
    else if (selected == '2') this.logout()
  }
}
