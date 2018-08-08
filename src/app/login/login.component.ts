import { Component, OnInit } from '@angular/core';

import { LoginService } from '../_services/login/login.service';
import { Router }    from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public username: string;
  public password: string;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {

  }

  //TODO add validation
  submit(event: Event, username: string, password: string){
    event.preventDefault();
    this.loginService.login(username, password)
      .then((data) => {
        if (!data){
          alert("wrong credentials");
        } else {
          this.redirectToHome();
        }
      })
      .catch((error) => {
        alert("Error");
      })
  }


  redirectToHome(){
    this.router.navigate(['/home']);
  }

}
