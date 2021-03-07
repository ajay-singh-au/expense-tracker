import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { utilHelpers } from '../services/utilHelpers';

@Injectable({
  providedIn: 'root',
})
export class expensesService {
  constructor(private http: HttpClient) {}
  addExpense(category: string, amount: string, date: string) {
    return this.http
      .post<any>(
        `http://localhost:8080/expense/add/2/${category}`,
        {
          date: date,
          amount: amount,
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
  getExpensebyDate(from: string, to: string) {
    return this.http
      .get<any>(`http://localhost:8080/expense/findBw/${from}/${to}`, {
        headers: utilHelpers.headers(),
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
