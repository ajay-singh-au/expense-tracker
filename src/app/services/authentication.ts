import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';

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
      .post<any>(`https://reqres.in/api/login`, {
        email: username,
        password: password,
      })
      .pipe(
        map((data) => {
          if (data && data.token) {
            localStorage.setItem(
              'currentUser',
              JSON.stringify(
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwidXNlcklkIjoibW0iLCJpYXQiOjE1MTYyMzkwMjJ9.MxK7rGBGHliT4FmIlk_o3-bOvbttqIosNH1S-t-pT3M'
              )
            );
            this.currentUserSubject.next(
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwidXNlcklkIjoibW0iLCJpYXQiOjE1MTYyMzkwMjJ9.MxK7rGBGHliT4FmIlk_o3-bOvbttqIosNH1S-t-pT3M'
            );
          }
          return data;
        })
      );
  }
  logout() {
    // remove user from local storage to log user out
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
}
