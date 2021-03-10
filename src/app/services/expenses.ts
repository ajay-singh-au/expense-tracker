import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { utilHelpers } from '../services/utilHelpers';

@Injectable({
  providedIn: 'root',
})
export class expensesService {
  constructor(private http: HttpClient) {}
  addExpense(
    category: string,
    amount: string,
    date: string,
    shopName: string,
    userId: string
  ) {
    let url = `http://localhost:8080/expense/add/${category}`;
    if (typeof userId != 'undefined')
      url = `http://localhost:8080/expense/add/${userId}/${category}`;
    return this.http
      .post<any>(
        `${url}`,
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
  getExpensebyDate(from: string, to: string, userId: string) {
    let url = `http://localhost:8080/expense/findBy/*/${from}/${to}`;
    if (typeof userId != 'undefined')
      url = `http://localhost:8080/expense/findBy/${userId}/*/${from}/${to}`;
    return this.http
      .get<any>(`${url}`, {
        headers: utilHelpers.headers(),
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getExpensebyDateandCategory(from: string, to: string, userId: string) {
    let url = `http://localhost:8080/expense/myNetPerCategory/${from}/${to}`;
    if (typeof userId != 'undefined')
      url = `http://localhost:8080/expense/netPerCategory/${userId}/${from}/${to}`;
    return this.http
      .get<any>(`${url}`, {
        headers: utilHelpers.headers(),
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  allExpenses(userId: string) {
    let url = `http://localhost:8080/expense/my`;
    if (typeof userId != 'undefined')
      url = `http://localhost:8080/expense/findByUser/${userId}`;
    return this.http
      .get<any>(`${url}`, {
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
}
