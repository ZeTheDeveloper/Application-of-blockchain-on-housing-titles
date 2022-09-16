import { Component, OnInit } from '@angular/core';
import {  NgForm  } from '@angular/forms';
import { FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserProfiles } from '../userProfile';
import { UserService } from '../services/user.service'

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  username = sessionStorage.getItem("username");
  identityNumber = sessionStorage.getItem("identityNumber");
  userAuthToken = sessionStorage.getItem("userAuthToken");
  role = sessionStorage.getItem("role");
  orgName = sessionStorage.getItem("orgName");
  address = sessionStorage.getItem("address");
  postCode = sessionStorage.getItem("postCode");
  state = sessionStorage.getItem("state");
  area = sessionStorage.getItem("area");
  country = sessionStorage.getItem("country");
  mobileNumber = sessionStorage.getItem("mobileNumber");
  email = sessionStorage.getItem("email");
  updateForm! : FormGroup;
  user = new UserProfiles(this.username, this.identityNumber, this.address, this.postCode, this.state, this.area, this.country, this.mobileNumber, this.email);
  response!: any;
  emailRegex!: any;

  constructor(private fb: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.myForm();
    this.emailRegex = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  }

  myForm(){
    this.updateForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit(){

    console.log(this.user.username);
    console.log(this.user.address);
    // console.log(this.user.password);

    let obj = {
      "address": this.user.address,
      "postCode": this.user.postCode,
      "state": this.user.state,
      "area": this.user.area,
      "country": this.user.country,
      "mobileNumber": this.user.mobileNumber,
      "email": this.user.email,
    };
    let json = JSON.parse(JSON.stringify(obj));

    (async() => {
      this.response = await this.userService.updateProfile(json);
      console.log(this.response);
      
      if(this.response.success === "true"){
        console.log("upadated");
        sessionStorage.setItem("address", this.response.address);
        sessionStorage.setItem("postCode", this.response.postCode);
        sessionStorage.setItem("state", this.response.state);
        sessionStorage.setItem("area", this.response.area);
        sessionStorage.setItem("country", this.response.country);
        sessionStorage.setItem("mobileNumber", this.response.mobileNumber);
        sessionStorage.setItem("email", this.response.email);
      }

      alert("Successfully updated");
    })();

    // // if user is logged in
    

    // // set the value to initial state
    // this.user.username = '';
    // this.user.password = '';

  }
}
