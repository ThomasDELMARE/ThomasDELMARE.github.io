import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../login/user.model';
import { LoginService } from './login.service';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root',
})


export class AuthService {
  loggedIn = false;
  user: User|undefined;
  userIsAdmin = false;

  constructor(private loginService:LoginService, private router: Router){
    (!!localStorage.getItem('jwtToken')) ? this.loggedIn = true : this.loggedIn = false;
  }

  // Dans la vraie vie (dans le projet à faire), on
  // passerait login et password.
  logIn(login:string, password:string) {
    this.loginService.getUser(login, password)
    .subscribe((userFetched) => {
      this.user = userFetched

      if(this.user != null) {
        this.loggedInAsUser();

        if(this.user.admin == true){
          this.loggedAsAdmin();
        }

        localStorage.setItem("jwtToken", this.user.jwtToken);

        // On veut rediriger sur Home que lorsque l'on fait une connexion depuis la page de connexion
        if(this.router.url === "/"){
          this.router.navigate(['./home']);
        }
      }
      else{
        console.log("User not fetched")
        // TODO : Ajouter snackbar
      }
    });
  }

  logOut() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("loggedIn");
    this.loggedIn = false;
    this.userIsAdmin = false;
    this.router.navigate(['/']);
  }

  loggedAsAdmin() {
    this.userIsAdmin = true;
    this.loggedIn = true;
    localStorage.setItem('loggedIn', 'true')
  }

  loggedInAsUser() {
    this.loggedIn = true;
    localStorage.setItem('loggedIn', 'true')
  }

  isLoggedIn(): Promise<boolean> {
    // On a un JWT token dans le local storage
    var token = localStorage.getItem("jwtToken");

    if(token != null) {
      var decryptedToken;

      try {
        decryptedToken = jwt_decode(token) as JwtToken;
      } catch(Error) {
        decryptedToken = null;
      }

      if(decryptedToken != null) {
        var login = decryptedToken.login;
        var password = decryptedToken.password;

        this.logIn(login, password);
      }
    }
    
    return new Promise((resolve, reject) => {
      resolve(this.loggedIn);
    });
  }

  isAdmin(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(this.userIsAdmin);
    });
  }

}

export interface JwtToken {
  login : string,
  password : string
}
