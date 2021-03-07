import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { utilHelpers } from '../services/utilHelpers';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { expensesService } from '../services/expenses';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css'],
})
export class AddExpenseComponent implements OnInit {
  data: any;
  myForm: FormGroup;
  selectedValue: string;
  maxDate = new Date();
  hide: boolean;
  error: String = '';
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private expensesServiceHelper: expensesService,
    private _snackBar: MatSnackBar
  ) {
    this.http
      .get<any>('http://localhost:8080/category/all', {
        headers: utilHelpers.headers(),
      })
      .subscribe((data) => {
        this.data = data;
      });
  }
  get amountInput() {
    return this.myForm.get('amount');
  }
  get categoryInput() {
    return this.myForm.get('category');
  }
  get dateInput() {
    return this.myForm.get('date');
  }
  get shopNameInput() {
    return this.myForm.get('shopName');
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      amount: new FormControl('', [Validators.required, Validators.required]),
      category: new FormControl('', [Validators.required, Validators.required]),
      shopName: new FormControl('', [Validators.required, Validators.required]),
      date: new FormControl('', [Validators.required, Validators.required]),
    });
    this.hide = true;
  }
  addExpense() {
    this.expensesServiceHelper
      .addExpense(
        this.categoryInput.value,
        this.amountInput.value,
        this.dateInput.value,
        this.shopNameInput.value
      )
      .pipe(first())
      .subscribe(
        (data) => {
          this._snackBar.open('Expense Added Successfully!!', '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
        },
        (error) => {
          this.error = error?.message;
          this._snackBar.open(error?.message, '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
        }
      );
  }
}
