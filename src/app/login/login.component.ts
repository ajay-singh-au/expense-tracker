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
    private router: Router
  ) {
    if (this.authenticationServiceHelper.currentUserValue) {
      this.router.navigate(['/employee-dashboard']);
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
      password: new FormControl('', [Validators.required, Validators.min(3)]),
    });
    this.hide = true;
  }
  login() {
    if (this.myForm.invalid) {
      return;
    }
    if (this.emailInput.value && this.passwordInput.value) {
      this.authenticationServiceHelper
        .login(this.emailInput.value, this.passwordInput.value)
        .pipe(first())
        .subscribe(
          (data) => {
            this.router.navigate(['/employee-dashboard']);
          },
          (error) => {
            this.error = error?.error?.error;
          }
        );
    }
  }
}
