import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  NgForm  } from '@angular/forms';
import { HashService } from '../services/hash.service';
import { HousingTitleService } from '../services/housing-title.service';
import { faUser, faMagnifyingGlass, faFilePdf, faCloudUpload, faCheck, faTimes} from '@fortawesome/free-solid-svg-icons';
import { SHA256  } from 'crypto-js'

@Component({
  selector: 'app-verify-housing-title',
  templateUrl: './verify-housing-title.component.html',
  styleUrls: ['./verify-housing-title.component.css']
})
export class VerifyHousingTitleComponent implements OnInit {
  allTitle?: any;
  user = faUser;
  magGlass = faMagnifyingGlass;
  file = faFilePdf;
  upload = faCloudUpload;
  check = faCheck;
  times = faTimes;
  fileToUpload: File | null = null;
  hash = '';
  fileName = '';
  contents!: any[];
  fileSize: number | undefined;
  data: any;
  exist?: boolean;

  constructor(private hashService: HashService, private housingTitleService: HousingTitleService) { }

  ngOnInit(): void {
    
  }
  
  async handleFileInput(files: FileList) {
    this.hash = "";
    this.fileName = "";
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload);

    if(this.fileToUpload){
      const file = this.fileToUpload;
    }


    const reader = new FileReader();

    const loaded = (el : any) => {
      const contents = el.target.result;
      // console.log('onloaded', contents);
      this.contents = contents;
      this.hash = SHA256(contents).toString();
      // console.log("hash", this.hash)
    }

    reader.onload = loaded;
    reader.readAsText(this.fileToUpload!, 'UTF-8');
    this.fileSize = this.fileToUpload!.size / 1000;
    this.fileName = this.fileToUpload!.name;

    // wait for this.hash to be loaded
    // (async() => {
    //   console.log("waiting for variable");
    //   while(!this.allTitle){
    //       await new Promise(resolve => setTimeout(resolve, 1000));
          this.verifyHousingTitle();
    //     }
    // })();

  }

  async verifyHousingTitle(){
    await this.housingTitleService.getAllTitle().then(data =>{
      console.log(data)
      this.allTitle = data;
      console.log(this.allTitle.result[0].ID);
    });

    this.exist = false;
    console.log(this.exist)
    this.allTitle.result.forEach((data: any) =>{
      console.log(data.hashValue.toString())
      console.log(this.hash.toString())

      if(data.hashValue === this.hash){
        this.exist = true;
        console.log(this.exist)
        
      }
    });
  }
}
