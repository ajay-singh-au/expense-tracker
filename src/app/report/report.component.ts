import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { utilHelpers } from '../services/utilHelpers';
import { expensesService } from '../services/expenses';
import { first } from 'rxjs/operators';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  userId = '';
  constructor(
    private expensesServiceHelper: expensesService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService
  ) {}
  ngOnInit(): void {
    this.range.valueChanges.subscribe(() => {
      if (this.range.value.from && this.range.value.to) {
        this.dates.from = this.range.value.from;
        this.dates.to = this.range.value.to;
      }
    });
    this.route.params.subscribe((params) => (this.userId = params['userid']));
  }
  dataSource: any;
  displayedColumns: string[] = [
    'category',
    'date',
    'shop',
    'amount',
    'percentage',
    'delete',
  ];
  displayedColumnsCategory: string[] = ['category', 'amount', 'percentage'];
  ciretera = 'date';
  dates: any = {};
  range = new FormGroup({
    from: new FormControl(),
    to: new FormControl(),
  });
  selectedDateExpenditure = [];
  selectedDateExpenditurebyCategory = [];
  allExpenses = [];
  fetch() {
    this.ngxService.start();
    if (!this.dates.from) this.dates.from = new Date();
    if (!this.dates.to) this.dates.to = new Date();
    this.expensesServiceHelper
      .getExpensebyDate(
        moment(this.dates.from).format('YYYY-MM-DD'),
        moment(this.dates.to).format('YYYY-MM-DD'),
        this.userId
      )
      .pipe(first())
      .subscribe(
        (data) => {
          data.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          this.dataSource = data;
          let arr = [];
          data.forEach((single) => {
            let index = arr.findIndex((e) => e.name === single.date);
            if (index >= 0) {
              arr[index].value = arr[index].value + single.amount;
            } else {
              arr.push({
                name: single.date,
                value: single.amount,
              });
            }
          });
          this.selectedDateExpenditure = arr;
          this.expensesServiceHelper
            .getExpensebyDateandCategory(
              moment(this.dates.from).format('YYYY-MM-DD'),
              moment(this.dates.to).format('YYYY-MM-DD'),
              this.userId
            )
            .subscribe((data) => {
              let arr = [];
              data.forEach((single) => {
                arr.push({
                  name: single.CategoryName,
                  value: parseInt(single.netAmount),
                });
              });
              this.selectedDateExpenditurebyCategory = arr;
            });
          this.expensesServiceHelper
            .allExpenses(this.userId)
            .subscribe((data) => {
              this.ngxService.stop();
              data.sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              );
              let arr = [];
              data.forEach((single) => {
                let index = arr.findIndex((e) => e.name === single.date);
                if (index >= 0) {
                  arr[index].value = arr[index].value + single.amount;
                } else {
                  arr.push({
                    name: single.date,
                    value: single.amount,
                  });
                }
              });
              this.allExpenses = arr;
            });
        },
        (error) => {}
      );
  }
  updateDates(e: any) {
    this.dates = utilHelpers.getDatesFunction(e);
  }
  deleteExpense(id: string) {
    this.ngxService.start();
    this.expensesServiceHelper
      .deleteExpense(id)
      .pipe(first())
      .subscribe(
        (data) => {},
        (error) => {
          this.ngxService.stop();
          if (error.status === 200) {
            this.fetch();
            this._snackBar.open('Expense Deleted Successfully', '', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
          } else {
            this._snackBar.open('Expense not Deleted. Please try again!!', '', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
          }
        }
      );
  }
  getTotalCost() {
    let totalCost = 0;
    this.dataSource.forEach((single) => {
      totalCost = totalCost + single.amount;
    });
    return totalCost;
  }
}
