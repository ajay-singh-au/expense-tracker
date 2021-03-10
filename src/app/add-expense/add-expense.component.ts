import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { utilHelpers } from '../services/utilHelpers';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { expensesService } from '../services/expenses';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css'],
})
export class AddExpenseComponent implements OnInit {
  data: any;
  userId = '';
  myForm: FormGroup;
  selectedValue: string;
  maxDate = new Date();
  error: String = '';
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private expensesServiceHelper: expensesService,
    private _snackBar: MatSnackBar,
    private ngxService: NgxUiLoaderService,
    private route: ActivatedRoute
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
    this.route.params.subscribe((params) => (this.userId = params['userid']));
  }
  addExpense() {
    this.ngxService.start();
    if (
      !this.categoryInput.value ||
      !this.amountInput.value ||
      !this.dateInput.value ||
      !this.shopNameInput.value
    ) {
      this.ngxService.stop();
      this._snackBar.open('Please fill all the Required Fields', '', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
      return;
    }
    this.expensesServiceHelper
      .addExpense(
        this.categoryInput.value,
        this.amountInput.value,
        this.dateInput.value,
        this.shopNameInput.value,
        this.userId
      )
      .pipe(first())
      .subscribe(
        (data) => {
          this.ngxService.stop();
          this._snackBar.open(
            `Expense Added Successfully for ${utilHelpers.toTitleCase(
              data?.user?.fname
            )} ${utilHelpers.toTitleCase(data?.user?.lname)} !!`,
            '',
            {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            }
          );
          this.myForm = this.fb.group({
            amount: new FormControl('', [
              Validators.required,
              Validators.required,
            ]),
            category: new FormControl('', [
              Validators.required,
              Validators.required,
            ]),
            shopName: new FormControl('', [
              Validators.required,
              Validators.required,
            ]),
            date: new FormControl('', [
              Validators.required,
              Validators.required,
            ]),
          });
        },
        (error) => {
          this.ngxService.stop();
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
