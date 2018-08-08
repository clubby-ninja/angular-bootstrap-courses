import { Injectable } from '@angular/core';

import { CanActivate, Router,
ActivatedRouteSnapshot,
RouterStateSnapshot }    from '@angular/router';

import { LoginService } from '../login/login.service'


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  canActivate() {
    return this.isLoggedin();
  }

  isLoggedin(){
    if (this.loginService.checkToken()){
      return true;
    }
    // Navigate to the login page with extras
    this.router.navigate(['']);
    return false;
  }
}
