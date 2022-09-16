import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {  NgForm  } from '@angular/forms';
import { HashService } from '../services/hash.service';
import { HousingTitleService } from '../services/housing-title.service';
import { faUser, faMagnifyingGlass, faFilePdf, faCloudUpload, faCheck} from '@fortawesome/free-solid-svg-icons';
import { DatePipe,formatDate } from '@angular/common';
import { SHA256  } from 'crypto-js';
import { HousingTitle } from '../housingTitle';

@Component({
  selector: 'app-create-housing-title',
  templateUrl: './create-housing-title.component.html',
  styleUrls: ['./create-housing-title.component.css']
})
export class CreateHousingTitleComponent implements OnInit {
  user = faUser;
  magGlass = faMagnifyingGlass;
  fileI = faFilePdf;
  upload = faCloudUpload;
  check = faCheck;
  fileToUpload!: File;
  fileUploaded = false;
  hash = '';
  fileName = '';
  contents!: any[];
  fileSize: number | undefined;
  todayDate = new Date();
  stringTodayDate!: string | null;
  createForm!: FormGroup;
  uploadForm!: FormGroup;
  ID!: string;
  identityNum!: any;
  name!: any;
  address!: any;
  state!: any;

  housingTitle = new HousingTitle(this.ID, this.identityNum, this.name, this.address, this.state, this.hash, this.stringTodayDate, this.fileName);

  constructor(
    private hashService: HashService, 
    private datePipe: DatePipe, 
    private housingTitleService: HousingTitleService,
    private fb: FormBuilder) { 
      this.stringTodayDate = this.datePipe.transform(this.todayDate, 'dd-MM-YYYY');
      
  }

  ngOnInit(): void {
    console.log(this.stringTodayDate);
    this.myForm();
  }

  myForm(){
    this.createForm = this.fb.group({
      ID: ['', Validators.required],
      identityNum: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      state: ['', Validators.required],
    })
    this.uploadForm = this.fb.group({
      file: ['', Validators.required],
    })
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files[0];
    
    // console.log(this.fileToUpload);

    if(this.fileToUpload){
      const file = this.fileToUpload;
      this.fileUploaded = true;
    }

    const reader = new FileReader();

    const loaded = (el : any) => {
      const contents = el.target.result;
    
      

      console.log('onloaded', contents);
      this.contents = contents;
      this.hash = SHA256(contents).toString();
      // this.hash = this.hashService.encrypt(contents);
      console.log("hash", this.hash)
    }

    reader.onload = loaded;
    reader.readAsText(this.fileToUpload!, 'UTF-8');
    this.fileSize = this.fileToUpload!.size / 1000;
    this.fileName = this.fileToUpload!.name;
    console.log(this.fileName)
  }

  onSubmit(){
    console.log(this.housingTitle.ID);
    console.log(this.housingTitle.identityNum);
    console.log(this.housingTitle.name);
    console.log(this.housingTitle.address);
    console.log(this.housingTitle.state);

    this.ID = this.housingTitle.ID;
    this.identityNum = this.housingTitle.identityNum.toString().padStart(12, "0");
    this.name = this.housingTitle.name;
    this.address = this.housingTitle.address;
    this.state = this.housingTitle.state;
    this.fileName = this.identityNum + "," + this.address.replace("/", ",") + "," + this.state + ".pdf"

    let obj = {"fcn": "CreateAsset",
      "peers": ["peer0.org1.example.com", "peer0.org2.example.com"],
      "args": [this.ID, this.identityNum, this.name, this.address, this.state, this.hash, this.stringTodayDate, this.fileName]
    };
    let json = JSON.parse(JSON.stringify(obj));

    if(this.hash === ''){
      alert('Please upload housing tile file of owner')
    }else{
      this.housingTitleService.createHousingTitle(json);

      // upload housing title pdf into server
      const formData = new FormData();
      
      formData.append("titlePDF", this.fileToUpload);
      this.housingTitleService.uploadFile(formData, this.fileName);
    }

    

    // set the value to initial state
    this.ID = '';
    this.identityNum = '';
    this.name = '';
    this.address = '';
    this.state = '';
    this.hash = '';
    this.fileName = '';
    this.fileUploaded = false;
  }

}
