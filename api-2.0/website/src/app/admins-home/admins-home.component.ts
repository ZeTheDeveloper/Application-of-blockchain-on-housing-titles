import { Component, OnInit } from '@angular/core';
import { faUser, faMagnifyingGlass, faFilePdf, faCloudUpload, faCheck, faUserPlus, faSignOut, faUserEdit, faFileUpload, faFile, faRemove} from '@fortawesome/free-solid-svg-icons';
import { HashService } from '../services/hash.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { async } from '@angular/core/testing';
import { ConnectableObservable } from 'rxjs';

@Component({
  selector: 'app-admins-home',
  templateUrl: './admins-home.component.html',
  styleUrls: ['./admins-home.component.css']
})
export class AdminsHomeComponent implements OnInit {
  user = faUser;
  userEdit = faUserEdit;
  userPlus = faUserPlus;
  magGlass = faMagnifyingGlass;
  file = faFilePdf;
  fileUpload = faFileUpload;
  upload = faCloudUpload;
  check = faCheck;
  logoutI = faSignOut;
  remove = faRemove;
  fileToUpload: File | null = null;
  hash = '';
  fileName = '';
  contents!: any[];
  fileSize: number | undefined;
  action = '';
  username = sessionStorage.getItem("username");
  identityNumber = sessionStorage.getItem("identityNumber");
  userAuthToken = sessionStorage.getItem("userAuthToken");
  email = sessionStorage.getItem("email");
  orgName = sessionStorage.getItem("orgName");
  response!: any;


  constructor(private router: Router, private userService: UserService) {
    
   }

  ngOnInit(): void {
    if(sessionStorage.getItem("role") === "admin"){

    }else{
      sessionStorage.clear();
      this.router.navigateByUrl('/login');
    }
  }

  logout(){
    // clear session in backend server
    this.userService.logout();

    // clear session in frontend 
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
    
  }


}
