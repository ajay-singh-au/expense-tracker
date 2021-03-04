import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  myForm: FormGroup;
  hide:boolean;
  constructor(private fb: FormBuilder) { }

  get emailInput() {
    return this.myForm.get("email");
  }
  get passwordInput() {
    return this.myForm.get("password");
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
    email: new FormControl('', [Validators.email, Validators.required ]),
    password: new FormControl('', [Validators.required, Validators.min(3) ]),
    });
    this.hide = true;
    
    this.myForm.valueChanges.subscribe(console.log)
    
  }

}
