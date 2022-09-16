import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CreateUsers } from '../createUser'

@Component({
  selector: 'app-add-owner',
  templateUrl: './add-owner.component.html',
  styleUrls: ['./add-owner.component.css']
})
export class AddOwnerComponent implements OnInit {
  createUserForm!: FormGroup;
  user = new CreateUsers("", "", null, "");

  constructor(private userService: UserService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.myForm();

    //generate random password by default
    this.user.password = Math.random().toString(36).substr(2, 8);
  }

  myForm(){
    this.createUserForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      identityNumber: ['', Validators.required],
      mobileNumber: ['', Validators.required],
    })

  }

  onSubmit(){
    // console.log(this.user.identityNumber.size);
    // console.log(this.user.identityNumber!.length);
    // console.log(this.user.identityNumber!.toString());

    let formattedIdentity = this.user.identityNumber!.toString().padStart(12, '0');
    console.log(formattedIdentity);

    
    // this.user.identityNumber = this.user.identityNumber.toString();
    // console.log(this.user.identityNumber);

    let obj = {
      username: this.user.username,
      password: this.user.password,
      identityNumber: formattedIdentity,
      mobileNumber: "0" + this.user.mobileNumber
    }

    let json = JSON.parse(JSON.stringify(obj));

    this.userService.createOwner(json);
  }

}
