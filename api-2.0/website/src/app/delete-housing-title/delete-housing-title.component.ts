import { Component, OnInit } from '@angular/core';
import { HousingTitleService } from '../services/housing-title.service';
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormsModule, FormGroup, FormControl, Validators, FormBuilder, Form } from '@angular/forms';

@Component({
  selector: 'app-delete-housing-title',
  templateUrl: './delete-housing-title.component.html',
  styleUrls: ['./delete-housing-title.component.css']
})
export class DeleteHousingTitleComponent implements OnInit {
  // title: any;
  searchButton = faSearch;
  trashButton = faTrash;
  address!: any;
  searchForm! : FormGroup;
  foundTitle!: any;
  serverFilename!: any;

  constructor(private housingTitleService: HousingTitleService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.myForm();
  }

  myForm(){
    this.searchForm = this.fb.group({
      
    })
  }

  async getTitleByAddress(address: string){
    await this.housingTitleService.getAllTitle().then(data =>{
      console.log(data)

      let formattedData = JSON.parse(JSON.stringify(data))
      
      
      formattedData.result.forEach((title: any) => {
        this.serverFilename = title.fileName;
        if(title.fullAddress === address)
          title.fileName = "../../HousingTitles/" + title.fileName;
          this.foundTitle = title;
          console.log(this.foundTitle);
        })
    });
  }

  onSearch(f: any){
    console.log(f)
    this.getTitleByAddress(f);
  }

  onDelete(titleID: string, fileName: string){
    let obj = {"fcn": "DeleteAsset",
      "peers": ["peer0.org1.example.com", "peer0.org2.example.com"],
      "args": [titleID, fileName]
    };

    let json = JSON.parse(JSON.stringify(obj));

    let objFilename = {"fileName": this.serverFilename};
    let jsonFileName = JSON.parse(JSON.stringify(objFilename));

    this.housingTitleService.deleteTitleFile(jsonFileName);
    this.housingTitleService.deleteHousingTitle(json);
    this.foundTitle = null;
  }

}
