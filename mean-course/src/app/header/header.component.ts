import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    userIsAuthenticated = false;
    private userAuthSubscription: Subscription;

    constructor(private authService: AuthService){}

    ngOnInit() {
        this.userAuthSubscription = this.authService.getAuthServiceListner()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
            })
    }

    onLogout() {
        this.authService.logout();
    }

    ngOnDestroy() {
        this.userAuthSubscription.unsubscribe()
    }
}

