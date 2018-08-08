import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { Course } from '../../_models/course';
import { RegisterResponse } from '../../_models/RegisterResponse';

import { Utils } from '../../util/util';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(
    private http: HttpClient,
    private util: Utils
  ) { }

  getCourses(): Observable<Course[]>{
    let requestPath = '/schoolsystem/api/v1/courses/';

    return this
      .http
      .get<Course[]>(this.util.siteUrl + requestPath, {headers: this.util.getAuthHeader()})
      .pipe(
      //tap(heroes => this.log('fetched heroes')),
      //catchError(this.handleError('getHeroes', []))
    );

  }

  getCourseInfo(id: string): Observable<Course>{
    let requestPath = '/schoolsystem/api/v1/courses/';

    return this
      .http
      .get<Course>(this.util.siteUrl + requestPath + id, {headers: this.util.getAuthHeader()})
      .pipe(
      //tap(heroes => this.log('fetched heroes')),
      //catchError(this.handleError('getHeroes', []))
    );

  }

  getStudentInCourse(courseId: string): Observable<Course>{
    let requestPath = '/schoolsystem/api/v1/courses/';

    return this
      .http
      .get<Course>(this.util.siteUrl + requestPath + courseId + '/students/', {headers: this.util.getAuthHeader()})
      .pipe(
      //tap(heroes => this.log('fetched heroes')),
      //catchError(this.handleError('getHeroes', []))
    );
  }

  addStudentToCourse(courseId: string, studentId: string): Promise<RegisterResponse>{
    let requestPath = '/schoolsystem/api/v1/courses/';

    let body = {
      'student_id': studentId
    };

    return new Promise((resolve, reject) => {
      this
        .http
        .post<RegisterResponse>(this.util.siteUrl + requestPath + courseId + '/students/', body, {headers: this.util.getAuthHeader()})
        .pipe()
        .subscribe(
          (data: RegisterResponse) => {
          resolve(data);
        },
        ((error: Error) => {
          reject(error);
        })
      );
    });
  }

}
