import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { authData } from "../auth/auth-data.model";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root'})
export class AuthService {
    private token: string;
    isAuthenticated = false;
    private authServiceListner = new Subject<boolean>();

    constructor(private http: HttpClient) {}

    getToken() {
        return this.token;
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
        this.http.post<{token: string}>('http://localhost:3000/api/user/login', authData)
            .subscribe(response => {
                const token = response.token;
                this.token = token;
                if(token) {
                    this.isAuthenticated = true;
                    this.authServiceListner.next(true);
                }
            })
    }
}