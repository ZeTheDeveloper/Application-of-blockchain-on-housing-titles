import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse ,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  userData?: any;
  authData?: any;

  constructor(private http: HttpClient) { 

  }

  
  private loginURL = 'http://localhost:4000/users/login';
  private updateURL = 'http://localhost:4000/users/update-profile'
  private checkAuthUrl = "http://localhost:4000/users/checkAuth"
  private logoutUrl = "http://localhost:4000/users/logout"
  private createOwnerUrl = "http://localhost:4000/users/owners/signup";
  private changePasswordUrl = "http://localhost:4000/users/owners/change-password"

  async login(loginData: JSON){
    return await this.http.post(this.loginURL, loginData).pipe(
    ).toPromise();
  }

  getUserData(loginData: JSON): Promise<Observable<any>>{

    return this.userData;
  }
  
  async updateProfile(updateData:JSON){
    return await this.http.post(this.updateURL, updateData).pipe().toPromise(); 
  }

  async authCheck(userData:JSON){
    return await this.http.post(this.checkAuthUrl, userData).pipe().toPromise();
  }

  async logout(){
    return await this.http.post(this.logoutUrl, null).pipe().toPromise();
  }

  async createOwner(userData:JSON){
    return this.http.post(this.createOwnerUrl, userData).subscribe(data => {

      console.log(data);
      let response = JSON.parse(JSON.stringify(data));

      if(response.success === "true"){
        alert("Successfully created owner");
      }else{
        alert("Error" + response.success);
      }
    })
  }

  async changePassword(userData:JSON){
    return this.http.post(this.changePasswordUrl, userData).subscribe(data =>{
      console.log(data);

      let response = JSON.parse(JSON.stringify(data));

      if(response.success === "true"){
        alert("Successfully changed password");

      }else if(response.success === "false"){
        alert("Error, please make sure you entered an correct old password");
      }
    })

  
}
}
