import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service'
import {  NgForm  } from '@angular/forms';
import { FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Users } from '../users';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm! : FormGroup;
  username!: string;
  password!: string;
  user = new Users(this.username, "", this.password, "");
  response: any | undefined;

  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.myForm();
  }

  myForm(){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }


  onSubmit(){

    console.log(this.user.username);
    console.log(this.user.password);

    let obj = {
      "username": this.user.username,
      "password": this.user.password
    };
    let json = JSON.parse(JSON.stringify(obj));

    (async() => {
      this.response = await this.userService.login(json);
      console.log(this.response);

      if(this.response.username){
        console.log("logged in");
        // sessionStorage.setItem("userAuthToken", this.response.userAuthToken);
        sessionStorage.setItem("identityNumber", this.response.identityNumber);
        sessionStorage.setItem("username", this.response.username);
        sessionStorage.setItem("role", this.response.role);
        sessionStorage.setItem("address", this.response.address);
        sessionStorage.setItem("postCode", this.response.postCode);
        sessionStorage.setItem("state", this.response.state);
        sessionStorage.setItem("area", this.response.area);
        sessionStorage.setItem("country", this.response.country);
        sessionStorage.setItem("mobileNumber", this.response.mobileNumber);
        sessionStorage.setItem("email", this.response.email);

        // if the user is an admin
        if(this.response.role === "admin"){
          console.log("admin users");
          sessionStorage.setItem("orgName", this.response.orgName);
          this.router.navigate(["/admins-home"]);
          
        }else if(this.response.role === "owner"){
          console.log("owner users");
          this.router.navigate(["/users-home"]);
        }
      }else{
        console.log("not logged in");
        alert("Wrong combination of username and password");
      }
    })();

    // if user is logged in
    

    // set the value to initial state
    this.user.username = '';
    this.user.password = '';

  }
}
