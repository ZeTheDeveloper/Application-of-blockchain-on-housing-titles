import { Component, OnInit } from '@angular/core';
import { Users } from '../users'
import { UserService } from '../services/user.service';
import { FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  user = new Users("", "", "", "");
  updatePasswordForm!: FormGroup;
  passwordRegex!: any;
  
  constructor(private fb:FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.myForm();
    this.passwordRegex = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[@#$%^&+=])(?=.*?[0-9]).{8,}$";
    this.user.username = sessionStorage.getItem("username");
  }

  myForm(){
    this.updatePasswordForm = this.fb.group({
      // username: ['', Validators.required],
      // password: ['', Validators.required],
      // confrimPassword: ['', Validators.required],

    })

  }

  onSubmit(){
    console.log(this.user.username);

    let obj = {
      username: this.user.username,
      password: this.user.oldPassword,
      newPassword: this.user.password,
      address: sessionStorage.getItem("address"),
      postCode: sessionStorage.getItem("postCode"),
      state: sessionStorage.getItem("state"),
      area: sessionStorage.getItem("area"),
      country: sessionStorage.getItem("country"),
      mobileNumber: sessionStorage.getItem("mobileNumber"),
      email: sessionStorage.getItem("email"),
    }

    let json = JSON.parse(JSON.stringify(obj));

    this.userService.changePassword(json);

  }

}
