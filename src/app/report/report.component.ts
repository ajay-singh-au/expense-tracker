import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { utilHelpers } from '../services/utilHelpers';
import { expensesService } from '../services/expenses';
import { first } from 'rxjs/operators';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
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
  generatePDF(type: string) {
    let fileName = `Expense Report from ${this.dates.from} to ${this.dates.to}`;
    var data = document.getElementById('contentToConvert');
    // var HTML_Width = data.offsetWidth;
    // var HTML_Height = data.offsetHeight;
    // var top_left_margin = 15;
    // var PDF_Width = HTML_Width + top_left_margin * 2;
    // var PDF_Height = PDF_Width * 1.5 + top_left_margin * 2;
    // var canvas_image_width = HTML_Width;
    // var canvas_image_height = HTML_Height;
    // var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
    // html2canvas(document.getElementById('contentToConvert'), {
    //   allowTaint: true,
    // }).then(function (canvas) {
    //   var imgData = canvas.toDataURL('image/jpeg', 1.0);
    //   var pdf = new jspdf('p', 'pt', [PDF_Width, PDF_Height]);
    //   pdf.addImage(
    //     imgData,
    //     'JPG',
    //     top_left_margin,
    //     top_left_margin,
    //     canvas_image_width,
    //     canvas_image_height
    //   );
    //   for (var i = 1; i <= totalPDFPages; i++) {
    //     pdf.addPage(PDF_Width.toString(), 'p');
    //     pdf.addImage(
    //       imgData,
    //       'JPG',
    //       top_left_margin,
    //       -(PDF_Height * i) + top_left_margin * 4,
    //       canvas_image_width,
    //       canvas_image_height
    //     );
    //   }
    //   if (type == 'email') {
    //     this.expensesServiceHelper
    //       .sendExpenseReport(pdf.output('datauristring').substring(51))
    //       .pipe(first())
    //       .subscribe(
    //         (data) => {
    //           console.log(data);
    //         },
    //         (error) => {
    //           console.log(error);
    //         }
    //       );
    //   }
    //   pdf.save(fileName);
    // });
    html2canvas(data).then((canvas) => {
      var imgWidth = 200;
      var pageHeight = 400;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = pageHeight - imgHeight;
      var position = 0;
      const contentDataURL = canvas.toDataURL('image/JPEG');
      var pdf = new jspdf('p', 'mm', 'a4', true);
      pdf.addImage(contentDataURL, 'JPEG', 5, 0, 200, 287, undefined, 'FAST');
      // while (heightLeft >= 0) {
      //   position = heightLeft - imgHeight;
      //   pdf.addPage();
      //   pdf.addImage(contentDataURL, 'JPEG', 5, 0, 200, 287, undefined, 'FAST');
      //   heightLeft -= pageHeight;
      // }
      if (type == 'email') {
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
      }
      pdf.save('newPDF.pdf');
    });
  }
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
