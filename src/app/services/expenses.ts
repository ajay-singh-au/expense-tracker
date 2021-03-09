import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { utilHelpers } from '../services/utilHelpers';

@Injectable({
  providedIn: 'root',
})
export class expensesService {
  constructor(private http: HttpClient) {}
  addExpense(category: string, amount: string, date: string, shopName: string) {
    return this.http
      .post<any>(
        `http://localhost:8080/expense/add/${category}`,
        {
          date: date,
          amount: amount,
          shopName: shopName,
        },
        {
          headers: utilHelpers.headers(),
        }
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  sendExpenseReport(base64: any) {
    let token = JSON.parse(localStorage.getItem('currentUser'));
    let headers = new HttpHeaders({
      'Content-Type': 'text/plain',
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .post<any>(`http://localhost:8080/report/send`, JSON.stringify(base64), {
        headers: headers,
      })
      .pipe(
        map((data) => {
          console.log(data);
          return data;
        })
      );
  }
  getExpensebyDate(from: string, to: string) {
    return this.http
      .get<any>(`http://localhost:8080/expense/findBy/*/${from}/${to}`, {
        headers: utilHelpers.headers(),
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getExpensebyDateandCategory(from: string, to: string) {
    return this.http
      .get<any>(
        `http://localhost:8080/expense/myNetPerCategory/${from}/${to}`,
        {
          headers: utilHelpers.headers(),
        }
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  allExpenses() {
    return this.http
      .get<any>(`http://localhost:8080/expense/my`, {
        headers: utilHelpers.headers(),
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  deleteExpense(id: string) {
    return this.http
      .delete<any>(`http://localhost:8080/expense/delete/${id}`, {
        headers: utilHelpers.headers(),
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
