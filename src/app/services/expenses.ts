import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

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
          headers: new HttpHeaders().set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzd2F4QGdtYWlsLmNvbSIsInJvbGVzIjoiUk9MRV9VU0VSIiwiaWF0IjoxNjE1MDQ2MTEyLCJleHAiOjE2MTUwNjQxMTJ9.cJmxd83UPXwKvfZ-2sCbG9AZzA067-l3Q9D64-mk3Fc'
          ),
        }
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getExpensebyDate(from: string, to: string) {
    console.log(from, to);
    return this.http
      .get<any>(`http://localhost:8080/expense/findBw/${from}/${to}`, {
        headers: new HttpHeaders().set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzd2F4QGdtYWlsLmNvbSIsInJvbGVzIjoiUk9MRV9VU0VSIiwiaWF0IjoxNjE1MDQ2MTEyLCJleHAiOjE2MTUwNjQxMTJ9.cJmxd83UPXwKvfZ-2sCbG9AZzA067-l3Q9D64-mk3Fc'
        ),
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
