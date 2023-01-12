import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gestion des assignments';

  constructor(private authService: AuthService,  private router: Router) {}

  logOut() {
    console.log("Déconnexion demandée")
    this.authService.logOut();
    this.router.navigate(['./']);
  }
}
