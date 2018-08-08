import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { Student } from '../../_models/student';

import { Utils } from '../../util/util';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(
    private http: HttpClient,
    private util: Utils
  ) { }

  getStudents(): Observable<Student[]>{
    let requestPath = '/schoolsystem/api/v1/students/';
    console.log(this.util.siteUrl + requestPath);
    return this
    .http
    .get<Student[]>(this.util.siteUrl + requestPath, {headers: this.util.getAuthHeader()})
    .pipe(
      //tap(heroes => this.log('fetched heroes')),
      //catchError(this.handleError('getHeroes', []))
    );

  }

  getStudentInfo(id: string): Observable<Student>{
    let requestPath = '/schoolsystem/api/v1/students/';

    return this
    .http
    .get<Student>(this.util.siteUrl + requestPath + id, {headers: this.util.getAuthHeader()})
    .pipe(
      //tap(heroes => this.log('fetched heroes')),
      //catchError(this.handleError('getHeroes', []))
    );

  }

  addNewStudent(student: Student): Promise<string>{
    let requestPath = '/schoolsystem/api/v1/students/';

    let body = {
      "first_name": student.first_name,
      "last_name": student.last_name,
      "last_name_second": student.last_name_second,
      "email": student.email,
      "phone": student.phone,
      "birth_date": student.birth_date
    };

    return new Promise((resolve, reject) => {
      this
      .http
      .post<string>(this.util.siteUrl + requestPath , body, {headers: this.util.getAuthHeader()})
      .pipe()
      .subscribe(
        (data: string) => {
          resolve(data);
        },
        ((error: Error) => {
          reject(error);
        })
      );
    });

  }

  editStudent(student: Student): Promise<Student> {
    let requestPath = '/schoolsystem/api/v1/students/';

    let body = {
      "first_name": student.first_name,
      "last_name": student.last_name,
      "last_name_second": student.last_name_second,
      "email": student.email,
      "phone": student.phone,
      "birth_date": student.birth_date
    };

    return new Promise((resolve, reject) => {
      this
      .http
      .put<Student>(this.util.siteUrl + requestPath + student.id , body, {headers: this.util.getAuthHeader()})
      .pipe()
      .subscribe(
        (data: Student) => {
          resolve(data);
        },
        ((error: Error) => {
          reject(error);
        })
      );
    });
  }

  deleteStudent(id: string): Promise<any>{
    let requestPath = '/schoolsystem/api/v1/students/';

    return new Promise((resolve, reject) => {
      this
      .http
      .delete<any>(this.util.siteUrl + requestPath + id, {headers: this.util.getAuthHeader()})
      .pipe()
      .subscribe(
        (data: any) => {
          resolve(data);
        },
        ((error: Error) => {
          reject(error);
        })
      );
    });
  }

}
