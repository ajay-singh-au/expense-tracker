import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { utilHelpers } from '../services/utilHelpers';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}
  getEmployee() {
    return this.http
      .get<any>(`http://localhost:8080/expense/all`, {
        headers: utilHelpers.headers(),
      })
      .pipe(
        map((data) => {
          console.log("get all user", data);
          return data;
        })
      );
  }
}
