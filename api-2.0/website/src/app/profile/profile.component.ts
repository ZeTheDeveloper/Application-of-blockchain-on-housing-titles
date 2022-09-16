import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

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

  constructor() { }

  ngOnInit(): void {
  }

}
