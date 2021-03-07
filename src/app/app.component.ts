import { authenticationService } from './services/authentication';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'expense tracker';
  constructor(private authenticationServiceHelper: authenticationService) {
    if (this.authenticationServiceHelper.currentUserValue) {
      this.authenticationServiceHelper.currentUser.subscribe((x) => {
        let expTime =
          this.authenticationServiceHelper.getDecodedAccessToken(x).exp * 1000;
        if (expTime < new Date().getTime()) {
          console.log('Session Expired');
          this.authenticationServiceHelper.logout();
        }
      });
    }
  }
  ngOnInit(): void {}
}
