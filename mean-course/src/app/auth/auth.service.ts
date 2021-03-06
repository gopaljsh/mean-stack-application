import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { authData } from "../auth/auth-data.model";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root'})
export class AuthService {
    private token: string;
    isAuthenticated = false;
    userId: string;
    logoutTimer: any;
    private authServiceListner = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
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
                //console.log(result);
            })
    }

    login(email: string, password: string) {
        const authData: authData = {email: email, password: password};
        this.http.post<{token: string, expirationIn: number, userId: string}>('http://localhost:3000/api/user/login', authData)
            .subscribe(response => {
                const token = response.token;
                this.token = token;
                if(token) {
                    const expirationIn = response.expirationIn;
                    this.setAuthTimer(expirationIn);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.authServiceListner.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expirationIn * 1000);
                    this.saveAuthData(token, expirationDate, this.userId);
                    this.router.navigate(['/'])
                }
            })
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if(!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if(expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authServiceListner.next(true);
        }
    }

    private setAuthTimer(duration: number) {
        this.logoutTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate.toISOString());
        localStorage.setItem("userId", userId);
    }

    private clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("expirationDate");
        localStorage.removeItem("userId");
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expirationDate");
        const userId = localStorage.getItem("userId");
        if(!token && !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authServiceListner.next(false);
        clearTimeout(this.logoutTimer);
        this.userId = null;
        this.clearAuthData();
        this.router.navigate(['/'])
    }
}