import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  response!: any;

  constructor(private userService: UserService, private router: Router) { 
    this.checkUser();
  }

  checkUser(){
    let obj = {
      "userAuthToken": sessionStorage.getItem("userAuthToken")
    };

    let json = JSON.parse(JSON.stringify(obj));

    {async() => {
      this.response = await this.userService.authCheck(json);
    }}
    
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return new Promise((resolve, reject) => {
        let obj = {
          "role": sessionStorage.getItem("role"),
          "identityNumber": sessionStorage.getItem("identityNumber")
        };
    
        let json = JSON.parse(JSON.stringify(obj));

        this.userService.authCheck(json).then((data) =>{
          this.response = data;
          if(this.response.authenticated === "true"){
            resolve(true);
          }else{
            this.router.navigate(["/login"]);
            resolve(false);
          }
        })
      })
      

      if(this.response.authenticated === "true"){
        return true;
      }

      this.router.navigate(['/login']);
      return false; 
  }
  
}
