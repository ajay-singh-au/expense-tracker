import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class authenticationService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;
    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }
    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }
  login(username: string, password: string) {
    return this.http.post<any>(`https://reqres.in/api/login`,{email: username, password:password})
        .pipe(map(data => {
            if (data && data.token) {
                localStorage.setItem('currentUser', JSON.stringify(data.token));
                this.currentUserSubject.next(data.token);
            }
            return data;
        }));
}
}
