import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { authenticationService } from '../services/authentication';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  hide: boolean;
  error: String = '';
  constructor(
    private fb: FormBuilder,
    private authenticationServiceHelper: authenticationService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private _snackBar: MatSnackBar
  ) {
    if (this.authenticationServiceHelper.currentUserValue) {
      if (
        this.authenticationServiceHelper.getDecodedAccessToken(
          this.authenticationServiceHelper.currentUserValue
        ).roles == 'ROLE_ADMIN'
      ) {
        this.router.navigate(['/all-users']);
      } else if (
        this.authenticationServiceHelper.getDecodedAccessToken(
          this.authenticationServiceHelper.currentUserValue
        ).roles == 'ROLE_USER'
      ) {
        this.router.navigate(['/employee-dashboard']);
      }
    }
  }
  get emailInput() {
    return this.myForm.get('email');
  }
  get passwordInput() {
    return this.myForm.get('password');
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    this.hide = true;
  }
  login() {
    this.ngxService.start();
    if (this.myForm.invalid) {
      this.ngxService.stop();
      this._snackBar.open('Please fill all the Required Fields', '', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
      return;
    }
    if (this.emailInput.value && this.passwordInput.value) {
      this.authenticationServiceHelper
        .login(this.emailInput.value, this.passwordInput.value)
        .pipe(first())
        .subscribe(
          (data) => {
            this.ngxService.stop();
            this._snackBar.open('Login Successfully', '', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
            if (
              this.authenticationServiceHelper.getDecodedAccessToken(
                this.authenticationServiceHelper.currentUserValue
              ).roles == 'ROLE_ADMIN'
            ) {
              this.router.navigate(['/all-users']);
            } else if (
              this.authenticationServiceHelper.getDecodedAccessToken(
                this.authenticationServiceHelper.currentUserValue
              ).roles == 'ROLE_USER'
            ) {
              this.router.navigate(['/employee-dashboard']);
            }
          },
          (error) => {
            this.ngxService.stop();
            this.error = error?.error?.message;
            this._snackBar.open(`${this.error}`, '', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
          }
        );
    }
  }
  forgot() {
    if (!this.emailInput.value) {
      this._snackBar.open('Please enter Email ID', '', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
    } else {
      this.authenticationServiceHelper
        .forgotPassword(this.emailInput.value)
        .pipe(first())
        .subscribe(
          (data) => {},
          (error) => {
            if (error.status === 200) {
              this._snackBar.open('Password sent on Email Successfully!!', '', {
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
              });
            } else {
              this._snackBar.open(error.error, '', {
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
              });
            }
          }
        );
    }
  }
}
