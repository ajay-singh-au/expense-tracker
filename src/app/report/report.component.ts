import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { utilHelpers } from '../services/utilHelpers';
import { expensesService } from '../services/expenses';
import { first } from 'rxjs/operators';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  constructor(
    private expensesServiceHelper: expensesService,
    private _snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.range.valueChanges.subscribe(() => {
      if (this.range.value.from && this.range.value.to) {
        this.dates.from = this.range.value.from;
        this.dates.to = this.range.value.to;
      }
    });
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
  generatePDF() {
    // Get the document to be downloaded.
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then((canvas) => {
      var imgWidth = 200;
      var pageHeight = 400;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      var position = 0;
      const contentDataURL = canvas.toDataURL('image/JPEG');
      var pdf = new jspdf('p', 'mm', 'a4', true);
      pdf.addImage(contentDataURL, 'JPEG', 5, 0, 200, 287, undefined, 'FAST');
      while (heightLeft >= 0) {
        console.log("hello");
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'JPEG', 5, 0, 200, 287, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
      // Blob given by JSPDF.
      // console.log(typeof pdf.output('blob'));
      // Blob converted by JSPDF.
      // var blobPDF = new Blob([pdf.output()], { type: 'application/pdf'});
      // console.log(typeof blobPDF);
      // function to get BASE64 encoded.
      this.expensesServiceHelper
          .sendExpenseReport(pdf.output('datauristring').substring(51))
          .pipe(first())
          .subscribe(
            (data) => {
              console.log(data);
            },
            (error) => {
              console.log(error);
            }
          );
      // function toBase64(blob: Blob): Observable<string> {
      //   const reader = new FileReader();
      //   reader.readAsDataURL(blob);
      //   return fromEvent(reader, 'load').pipe(
      //     map(() => (reader.result as string).split(',')[1])
      //   );
      // }
      // // make request after conversion.
      // toBase64(blobPDF).subscribe((base64) => {
      //   // console.log(base64);
      //   this.expensesServiceHelper
      //     .sendExpenseReport(pdf.output('datauristring').substring(51))
      //     .pipe(first())
      //     .subscribe(
      //       (data) => {
      //         console.log(data);
      //       },
      //       (error) => {
      //         console.log(error);
      //       }
      //     );
      // });
      pdf.save('newPDF.pdf');
    });
  }
  fetch() {
    if (!this.dates.from) this.dates.from = new Date();
    if (!this.dates.to) this.dates.to = new Date();
    this.expensesServiceHelper
      .getExpensebyDate(
        moment(this.dates.from).format('YYYY-MM-DD'),
        moment(this.dates.to).format('YYYY-MM-DD')
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
              moment(this.dates.to).format('YYYY-MM-DD')
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
          this.expensesServiceHelper.allExpenses().subscribe((data) => {
            data.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
        (error) => {
          console.log(error);
        }
      );
  }
  updateDates(e: any) {
    this.dates = utilHelpers.getDatesFunction(e);
  }
  deleteExpense(id: string) {
    this.expensesServiceHelper
      .deleteExpense(id)
      .pipe(first())
      .subscribe(
        (data) => {},
        (error) => {
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
