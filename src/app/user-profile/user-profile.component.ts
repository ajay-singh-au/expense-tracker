import { Component, OnInit } from '@angular/core';
import { authenticationService } from '../services/authentication';
import { first } from 'rxjs/operators';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  myForm: FormGroup;
  currentUser;
  change = 'false';
  get currentPasswordInput() {
    return this.myForm.get('currentPassword');
  }
  get newPasswordInput() {
    return this.myForm.get('newPassword');
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
    });
  }
  constructor(
    private fb: FormBuilder,
    private authenticationServiceHelper: authenticationService,
    private _snackBar: MatSnackBar
  ) {
    this.authenticationServiceHelper.currentUser.subscribe((x) => {
      this.currentUser = this.authenticationServiceHelper.getDecodedAccessToken(
        x
      );
      let roles = '';
      if (this.currentUser?.roles.includes('USER')) roles = 'userping';
      if (this.currentUser?.roles.includes('ADMIN')) roles = 'adminping';
      this.authenticationServiceHelper
        .getUserProfile(roles)
        .pipe(first())
        .subscribe(
          (data) => {
            this.currentUser = data;
          },
          (error) => {}
        );
    });
  }
  changePassword() {
    this.change = 'true';
  }
  updatePassword() {
    if (!this.currentPasswordInput.value) {
      this._snackBar.open('Please Enter Current Password!!', '', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
      return;
    }
    this.authenticationServiceHelper
      .changePassword(
        this.currentPasswordInput.value,
        this.newPasswordInput.value
      )
      .pipe(first())
      .subscribe(
        (data) => {},
        (error) => {
          if (error.status === 200) {
            this._snackBar.open('Passwrod Changed Successfully', '', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
          } else {
            this._snackBar.open(
              'Entered Currenct Password is invalid. Please try again!!',
              '',
              {
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
              }
            );
          }
        }
      );
  }
}
