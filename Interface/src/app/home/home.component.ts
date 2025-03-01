import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppComponent } from '../app.component';
import { HeaderComponent } from '../header/header.component';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}