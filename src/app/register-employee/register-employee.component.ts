import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'register-employee',
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.css']
})
export class RegisterEmployeeComponent implements OnInit {
  registerForm:FormGroup;
  error: String = ""

  constructor(private fb: FormBuilder) { }

  get idInput() {
    return this.registerForm.get('id');
  }  
  get fnameInput() {
    return this.registerForm.get('fname');
  }
  get lnameInput() {
    return this.registerForm.get('lname');
  }
  get emailInput() {
    return this.registerForm.get('email');
  }
  get passwordInput() {
    return this.registerForm.get('password');
  }
  get rpasswordInput() {
    return this.registerForm.get('rpassword');
  }

  ngOnInit(): void {
     this.registerForm = this.fb.group({
      id: new FormControl('', [Validators.required]),
      fname: new FormControl('', [Validators.required]),
      lname: new FormControl('', [Validators.required]),
      email: new FormControl('',  [Validators.required, Validators.required]),
      password: new FormControl('', [Validators.required, Validators.min(3)]),
      rpassword: new FormControl('', [Validators.required, Validators.min(3)]),
    });
  }
   register() {
    if (this.registerForm.invalid) {
      return;
    }}

}
