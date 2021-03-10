import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { utilHelpers } from '../services/utilHelpers';

@Injectable({
  providedIn: 'root',
})
export class authenticationService {
  // Used to set current User.
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }
  // Check if User is logged in or not.
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  // Login Api, Ussername and Password
  login(username: string, password: string) {
    return this.http
      .post<any>(`http://localhost:8080/users/authenticate`, {
        email: username,
        password: password,
      })
      .pipe(
        map((data) => {
          if (data && data.token) {
            localStorage.setItem('currentUser', JSON.stringify(data.token));
            this.currentUserSubject.next(data.token);
          }
          return data;
        })
      );
  }
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
  getUserProfile(roles) {
    return this.http
      .get<any>(`http://localhost:8080/users/userping`, {
        headers: utilHelpers.headers(),
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  changePassword(currentPassword: string, newPassword: string) {
    return this.http
      .post<any>(
        `http://localhost:8080/users/changepassword`,
        {
          newPassword: newPassword,
          currentPassword: currentPassword,
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
  forgotPassword(email: string) {
    return this.http
      .post<any>(`http://localhost:8080/users/forgotpassword`, {
        email: email,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
