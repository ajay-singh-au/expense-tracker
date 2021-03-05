import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class expensesService {
  constructor(private http: HttpClient) {}
  addExpense(category: string, amount: string, date: string) {
    return this.http
      .post<any>(`http://localhost:8080/expense/add/${category}`, {
        date: date,
        amount: amount,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
