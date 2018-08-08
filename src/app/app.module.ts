import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { routing } from './app.routes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MatDialogModule } from '@angular/material/dialog';



import { HttpModule } from '@angular/http'; //TODO remove
import { HttpClientModule } from '@angular/common/http';

import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import 'hammerjs';

import { StudentDetailComponent } from './student-detail/student-detail.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { NewStudentComponent } from './new-student/new-student.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    StudentDetailComponent,
    CourseDetailComponent,
    NewStudentComponent,
  ],
  imports: [
    routing,
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    HttpModule,
    HttpClientModule,
    FormsModule,


    NgbModule.forRoot()
  ],
  bootstrap: [AppComponent],
  entryComponents: [NewStudentComponent],
})
export class AppModule { }
