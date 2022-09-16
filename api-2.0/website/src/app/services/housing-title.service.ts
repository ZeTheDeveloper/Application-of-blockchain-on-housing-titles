import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse ,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HousingTitleService {
  housingTitleID: any | undefined;
  allHousingTitle?: any;
  allFilesName?: any;
  ownerFileList: Array<string> = [];

  // token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NjEwMjYxNjUsInVzZXJuYW1lIjoiemU0Iiwib3JnTmFtZSI6Ik9yZzEiLCJpYXQiOjE2NjA5OTAxNjV9.BtrQeSYLtanugFKXdFYZyHfm78P9Buv3FxdjlWhIR9E'
  
  constructor(private http: HttpClient) { }

  private rootURL = 'http://localhost:4000/channels/mychannel/chaincodes/housingtitle';
  
  async createHousingTitle(housingTitleData: JSON){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${this.token}`
    })

    return this.http.post(this.rootURL, housingTitleData, {headers: headers}).subscribe(data => {
     this.housingTitleID = data;
     console.log("service: " + data);

      let json = JSON.parse(JSON.stringify(data));
      console.log(json.success);
     if(json.success === "true"){
      alert("Housing Title Successfully Added");
     }else{
      alert("Failed to add housing title");
     }
   })
  }

  async deleteHousingTitle(deleteTitle: JSON){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${this.token}`
    })

    return this.http.post(this.rootURL, deleteTitle, {headers: headers}).subscribe(data => {
     this.housingTitleID = data;
     console.log("service: " + data);

      let json = JSON.parse(JSON.stringify(data));
      console.log(json.success);
     if(json.success === "true"){
      alert("Housing Title Successfully Deleted");
     }else{
      alert("Failed to delete housing title");
     }
   })
  }


  async getAllTitle(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${this.token}`
    })

    return await this.http.get(this.rootURL + '/queryAll?fcn=GetAllAssets&args=["Asset22"]', {headers: headers}).pipe().toPromise();
  }

  async getAllFileName(){

    return await this.http.get('http://localhost:4000/getTitlesFilename').pipe().toPromise();

  }

  async deleteTitleFile(fileName: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${this.token}`
    })

    return await this.http.post('http://localhost:4000/deleteTitleFile', fileName, {headers: headers}).pipe().toPromise();
  }
  

  async getFileByIdentityNumber(identityNumber: string){
    this.ownerFileList = [];

    return await this.getAllFileName().then(data =>{
      console.log(data);
      
      let json = JSON.parse(JSON.stringify(data));

      json.forEach((fileName: string)=> {
        console.log(fileName);

        if(fileName.includes(identityNumber)){
          if(!this.ownerFileList.includes(fileName)){
            console.log("true");
            this.ownerFileList.push(fileName);
          }
        }
        console.log(this.ownerFileList);
      })
      return this.ownerFileList;
    });

  }


  uploadFile(uploadData: FormData, fileName: string){
    console.log(uploadData);
    return this.http.post('http://localhost:4000/file-upload/' + fileName, uploadData).subscribe(data => {
      console.log(uploadData);
      return data;
      
   })
  }
}
