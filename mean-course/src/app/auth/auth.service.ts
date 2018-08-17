import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { authData } from "../auth/auth-data.model";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root'})
export class AuthService {
    private token: string;
    isAuthenticated = false;
    logoutTimer: any;
    private authServiceListner = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getAuthServiceListner() {
        return this.authServiceListner.asObservable();
    }

    getAuthStatusUpdated() {
        return this.isAuthenticated;
    }

    createUser(email: string, password: string) {
        const authData: authData = {
            email: email,
            password: password
        }
        this.http.post('http://localhost:3000/api/user/signup', authData)
            .subscribe(result => {
                console.log(result);
            })
    }

    login(email: string, password: string) {
        const authData: authData = {email: email, password: password};
        this.http.post<{token: string, expirationIn: number}>('http://localhost:3000/api/user/login', authData)
            .subscribe(response => {
                console.log(response)
                const token = response.token;
                this.token = token;
                const expirationIn = response.expirationIn;
                this.logoutTimer = setTimeout(() => {
                    this.logout();
                }, expirationIn); 
                if(token) {
                    this.isAuthenticated = true;
                    this.authServiceListner.next(true);
                    this.router.navigate(['/'])
                }
            })
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authServiceListner.next(false);
        clearTimeout(this.logoutTimer);
        this.router.navigate(['/'])
    }
}