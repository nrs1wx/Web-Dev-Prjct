import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule, RouterOutlet} from "@angular/router";
import {NavbarComponent} from "./navbar/navbar.component";
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, NavbarComponent],
  standalone: true
})
export class AppComponent {
  title = 'PlaneMarket_front';

  constructor(private auth: AuthService) {
    this.auth.initCurrentUser();
  }
}
