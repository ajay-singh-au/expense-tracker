import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { utilHelpers } from '../services/utilHelpers';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  constructor(private http: HttpClient) {}
  getEmployee() {
    return this.http
      .get<any>(`http://localhost:8080/expense/netPerUser`, {
        headers: utilHelpers.headers(),
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  registerUser(fname: string, lname: string, email: string, role: string) {
    return this.http
      .post<any>(
        `http://localhost:8080/users/register/${role}`,
        {
          email: email,
          fname: fname,
          lname: lname,
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
  deleteuser(id: string) {
    console.log(id);
    return this.http
      .delete<any>(`http://localhost:8080/users/delete/${id}`, {
        headers: utilHelpers.headers(),
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
