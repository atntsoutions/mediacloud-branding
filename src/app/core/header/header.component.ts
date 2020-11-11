import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Menum } from '../models/menum';
import { GlobalService } from '../services/global.service';
import { LoginService } from '../services/login.service';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    public isNavbarCollapsed = true;
    public gs: GlobalService;

    title = "CARL ZEISS";
    id: string = "";
    constructor(
        private router: Router,
        private gs1: GlobalService,
        private loginservice: LoginService) {
        this.gs = gs1;
    }

    LoadPage(rec: Menum) {
        let bFlag: boolean = false;
        this.getUrlID();

        var param = JSON.parse(rec.menu_route2);
        
        console.log('Menu Navigation', rec.menu_route1, param);

        this.router.navigate([rec.menu_route1], { queryParams: param});
    }

    home(){
        if (this.gs.IsAuthenticated)
            this.router.navigate(['/home']);
        else 
            this.router.navigate(['/home'], { replaceUrl: true });
    }

    contact(){
        this.router.navigate(['/contact']);
    }

    login(){
        this.router.navigate(['login'], { replaceUrl: true });
    }


    Logout() {

        this.loginservice.Logout();

        this.gs1.resetMenu();
        
        localStorage.removeItem ('menu');
        localStorage.removeItem('modules');
        localStorage.removeItem('gv');
        localStorage.removeItem('dv');
        localStorage.removeItem('access_token');

        this.router.navigate(['home'], { replaceUrl: true });
    }

    getUrlID() {
        this.id = this.gs1.getGuid();
    }

}
