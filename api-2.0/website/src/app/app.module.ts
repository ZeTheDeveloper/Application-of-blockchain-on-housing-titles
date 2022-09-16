// libraries
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UsersHomeComponent } from './users-home/users-home.component';
import { AdminsHomeComponent } from './admins-home/admins-home.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateHousingTitleComponent } from './create-housing-title/create-housing-title.component';
import { VerifyHousingTitleComponent } from './verify-housing-title/verify-housing-title.component';
import { ViewHousingTitleComponent } from './view-housing-title/view-housing-title.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { AddOwnerComponent } from './add-owner/add-owner.component';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DeleteHousingTitleComponent } from './delete-housing-title/delete-housing-title.component';

@NgModule({
  declarations: [
    
    AppComponent,
    LoginComponent,
    UsersHomeComponent,
    AdminsHomeComponent,
    ProfileComponent,
    CreateHousingTitleComponent,
    VerifyHousingTitleComponent,
    ViewHousingTitleComponent,
    UpdateProfileComponent,
    AddOwnerComponent,
    ChangePasswordComponent,
    DeleteHousingTitleComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PdfJsViewerModule,
    ShowHidePasswordModule,
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
