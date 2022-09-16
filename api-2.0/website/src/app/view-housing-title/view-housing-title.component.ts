import { Component, OnInit } from '@angular/core';
import { HousingTitleService } from '../services/housing-title.service';

@Component({
  selector: 'app-view-housing-title',
  templateUrl: './view-housing-title.component.html',
  styleUrls: ['./view-housing-title.component.css']
})
export class ViewHousingTitleComponent implements OnInit {
  allTitle: Array<string> = [];
  allAdminTitle: any = [];
  appendedAllTitle: Array<string> = [];
  userIdentityNumber?: any;
  role = sessionStorage.getItem("role");

  constructor(private housingTitleService: HousingTitleService) { }

  ngOnInit(): void {
    this.allTitle = [];
    this.appendedAllTitle = [];
    this.getTitlesFiles();
  }

  async getTitlesFiles(){

    if(this.role === "owner"){
      await this.housingTitleService. getFileByIdentityNumber(sessionStorage.getItem("identityNumber")!).then(data =>{
        this.allTitle = data;
      })

      this.allTitle.forEach((data: string) => {
        this.appendedAllTitle.push("../../HousingTitles/" + data);
        console.log(this.appendedAllTitle);
      })
    }else if(this.role === "admin"){
      await this.housingTitleService.getAllTitle().then(data =>{
        console.log(data)

        let formattedData = JSON.parse(JSON.stringify(data))
        
        
        formattedData.result.forEach((title: any) => {
          title.fileName = "../../HousingTitles/" + title.fileName;
          this.allAdminTitle.push(title);
        })

        // this.allTitle.forEach((data: string) => {
        //   this.appendedAllTitle.push("../../HousingTitles/" + data);
        //   console.log(this.appendedAllTitle);
        // })
      });
    }
    
  }

  showHousingTitle(){
    // for each file names, if contain user.identityNumber, then add into array
  }


}
