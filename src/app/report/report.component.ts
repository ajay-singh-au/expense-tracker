import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { utilHelpers } from '../services/utilHelpers';
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
  ngOnInit(): void {
    this.range.valueChanges.subscribe(() => {
      if (this.range.value.from && this.range.value.to) {
        this.dates.from = this.range.value.from;
        this.dates.to = this.range.value.to;
      }
    });
  }
  dataSource: any;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  ciretera = 'date';
  dates: any = {};
  range = new FormGroup({
    from: new FormControl(),
    to: new FormControl(),
  });
  fetch() {
    this.expensesServiceHelper
      .getExpensebyDate(
        moment(this.dates.from).format('YYYY-MM-DD'),
        moment(this.dates.to).format('YYYY-MM-DD')
      )
      .pipe(first())
      .subscribe(
        (data) => {
          console.log(data);
          data.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          this.dataSource = data;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  updateDates(e: any) {
    this.dates = utilHelpers.getDatesFunction(e);
  }
}
