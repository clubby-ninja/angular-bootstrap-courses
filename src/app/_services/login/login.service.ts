import { Injectable } from '@angular/core';

import { Http, Headers, Response } from '@angular/http';

import { Observable, of } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';

import { Utils } from '../../util/util';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: Http,
    private utils: Utils
  ) { }


  login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.requestToken(username, password)
        .then((data) => {
          console.log("data");
          console.log(data);
          resolve(data);
        })
        .catch((error: Error) => {
          console.log("error");
          console.log(error);
          reject();
        })
    });
  }

  logout(): void {
    this.utils.clearToken();
  }

  checkToken(){
    if(!this.utils.checkTimestamp){
      this.logout();
      return false;
    }
    return !!this.utils.getToken()
  }

  /*request a token with the given username and password*/
  requestToken(username: string, password: string): Promise<boolean>{
    let requestPath = '/schoolsystem/api/v1/oauth/';

    let body = {
      /*Dummy info
      "username": "root",
      "password": "m3j14*m3j14"
       */
       "username": username,
       "password": password
    };

    return new Promise((resolve, reject) => {
      this.http.post(this.utils.siteUrl + requestPath, body, {})
        .pipe(
          map(response => response.json()),
        )
        .subscribe(
          (data) => {
            //the server gave a token
            if (data.token){
              this.utils.setToken(data.token);
              resolve(true);
              return;
            }
            resolve(false);
          },
          (error) => {
            reject(error);
          }
        );
    })
  }

  getToken(): string{
    return this.utils.getToken();
  }

}
