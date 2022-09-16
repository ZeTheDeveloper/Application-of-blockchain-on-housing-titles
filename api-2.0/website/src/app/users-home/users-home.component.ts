import { Component, OnInit } from '@angular/core';
import { faUser, faMagnifyingGlass, faFilePdf, faCloudUpload, faCheck, faUserPlus, faSignOut, faKey} from '@fortawesome/free-solid-svg-icons';
import { HashService } from '../services/hash.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users-home',
  templateUrl: './users-home.component.html',
  styleUrls: ['./users-home.component.css']
})
export class UsersHomeComponent implements OnInit {

  user = faUser;
  magGlass = faMagnifyingGlass;
  file = faFilePdf;
  upload = faCloudUpload;
  check = faCheck;
  userPlus = faUserPlus;
  logoutI = faSignOut;
  passwordI = faKey;
  fileToUpload: File | null = null;
  hash = '';
  fileName = '';
  contents!: any[];
  fileSize: number | undefined;
  action = '';
  username = sessionStorage.getItem("username");
  email = sessionStorage.getItem("email");

  constructor(private hashService: HashService, private router: Router, private userService: UserService) {

    const form = document.querySelector<HTMLElement>("form"),
    fileInput = form?.querySelector<HTMLFormElement>(".file-input"),
    progressArea = document.querySelector(".progress-area"),
    uploadedArea = document.querySelector(".uploaded-area");

    const input = document.getElementById('fileInput');
    
    }

  ngOnInit(): void {
    if(sessionStorage.getItem("role") === "owner"){

    }else{
      sessionStorage.clear();
      this.router.navigateByUrl('/login');
    }
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload);

    if(this.fileToUpload){
      const file = this.fileToUpload;
    }

    const reader = new FileReader();

    const loaded = (el : any) => {
      const contents = el.target.result;
      console.log('onloaded', contents);
      this.contents = contents;
      this.hash = this.hashService.encrypt(contents);
      console.log("hash", this.hash)
    }

    reader.onload = loaded;
    reader.readAsText(this.fileToUpload!, 'UTF-8');
    this.fileSize = this.fileToUpload!.size / 1000;
    this.fileName = this.fileToUpload!.name;
    console.log(this.fileName)
  }

  logout(){
    // clear session in backend server
    this.userService.logout();

    // clear session in frontend 
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
    
  }





}
