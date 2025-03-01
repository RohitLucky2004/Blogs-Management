import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
    standalone: true,
  imports: [RouterOutlet,RouterLink,CommonModule,ReactiveFormsModule,FormsModule,HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private router:Router, public service:AppService){}
  
}
