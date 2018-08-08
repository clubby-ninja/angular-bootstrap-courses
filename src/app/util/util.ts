import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Utils {
  private token_key = '70632'
  private timestamp_key = '718357'

  siteUrl: string = 'http://35.190.145.161:9001';
  token: string;
  timestamp: number;

  constructor(
  ) {
    this.token = localStorage.getItem(this.token_key);
    this.timestamp = Number(localStorage.getItem(this.timestamp_key));
   }

  getAuthHeader(): HttpHeaders{
    let authHeader = new HttpHeaders();
    authHeader = authHeader.set('Authorization', 'Token ' + this.token);
    return authHeader;
  }

  getCorsAuthHeader(): HttpHeaders{
    let authHeader = new HttpHeaders();
    authHeader = authHeader.set('Authorization', 'Token ' + this.token);
    authHeader = authHeader.set('Access-Control-Allow-Origin', '*');
    return authHeader;
  }

  setToken(token: string){
    localStorage.setItem(this.token_key, token);
    localStorage.setItem(this.timestamp_key, String(new Date().getTime()));
    this.token = token;
  }

  getToken(): string {
    return this.token
  }

  checkTimestamp(): boolean {
    console.log("timestamp");
    console.log(Math.abs(new Date().getTime() - this.timestamp) / 3600000);
    return (Math.abs(new Date().getTime() - this.timestamp) / 3600000 < 12)
  }

  clearToken(){
    localStorage.clear();
    this.token = null;
    this.timestamp = 0;
  }



  public static isEmail(email:string): boolean{
    return(
      new RegExp(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ).test(email));
  }

  public static isEmpty(input: string): boolean{
    return input.trim().length == 0;
  }

}
