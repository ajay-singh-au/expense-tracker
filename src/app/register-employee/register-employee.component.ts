import { ManagerService } from './../services/manager';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'register-employee',
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.css'],
})
export class RegisterEmployeeComponent implements OnInit {
  registerForm: FormGroup;
  error: String = '';

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private registerUser: ManagerService,
    private ngxService: NgxUiLoaderService
  ) {}

  get fnameInput() {
    return this.registerForm.get('fname');
  }
  get lnameInput() {
    return this.registerForm.get('lname');
  }
  get emailInput() {
    return this.registerForm.get('email');
  }
  get roleInput() {
    return this.registerForm.get('role');
  }
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      id: new FormControl('', [Validators.required]),
      fname: new FormControl('', [Validators.required]),
      lname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.required]),
      role: new FormControl('', [Validators.required, Validators.required]),
    });
  }
  register() {
    this.ngxService.start();
    if (
      this.fnameInput.value &&
      this.lnameInput.value &&
      this.emailInput.value &&
      this.roleInput.value
    ) {
      this.registerUser
        .registerUser(
          this.fnameInput.value,
          this.lnameInput.value,
          this.emailInput.value,
          this.roleInput.value
        )
        .pipe(first())
        .subscribe(
          (data) => {
            this.ngxService.stop();
            this._snackBar.open(
              `User Registered Successfully!, Employee's ID is${data.id}, an email with login credentialis is sent to ${data.email}`,
              '',
              {
                duration: 10000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              }
            );
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
    } else {
      this.ngxService.stop();
      this._snackBar.open('Please Fill all Fields', '', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
    }
  }
}
