import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { getDates } from '../services/getDates';
import { expensesService } from '../services/expenses';
import { first } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  constructor(private expensesServiceHelper: expensesService) {}
  ngOnInit(): void {}
  dataSource: any;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  ciretera = 'date';
  dates: any = {};
  range = new FormGroup({
    from: new FormControl(),
    to: new FormControl(),
  });
  fetch() {
    console.log(this.ciretera);
    if (this.ciretera == 'custom') {
      this.expensesServiceHelper
        .getExpensebyDate(this.dates.from, this.dates.to)
        .pipe(first())
        .subscribe(
          (data) => {
            console.log(data);
            this.dataSource = data;
          },
          (error) => {
            console.log(error);
          }
        );
    } else if (this.ciretera == 'date') {
      this.expensesServiceHelper
        .getExpensebyDate(
          moment(this.range.value.from).format('YYYY-MM-DD'),
          moment(this.range.value.to).format('YYYY-MM-DD')
        )
        .pipe(first())
        .subscribe(
          (data) => {
            console.log(data);
            this.dataSource = data;
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
  updateDates(e: any) {
    this.dates = getDates.getDatesFunction(e);
  }
}
