
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { TreeModule } from 'angular-tree-component';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers, metaReducers } from './reducers';
import { environment } from '../environments/environment';

import { StoreRouterConnectingModule, NavigationActionTiming, RouterState } from '@ngrx/router-store';


import { GlobalService } from './core/services/global.service';
import { LoginService } from './core/services/login.service';
import { HomeComponent } from './core/home/home.component';
import { HeaderComponent } from './core/header/header.component';
import { LoginComponent } from './core/login/login.component';
import { LoginBranchComponent } from './core/loginbranch/loginbranch.component';
import { ContactComponent } from './core/contact/contact.component';
import { LoadingScreenComponent } from './core/loadingscreen/loading-screen.component';
import { InterceptorService } from './core/services/interceptor.service';
import { LoadingScreenService } from './core/services/loadingscreen.service';
import { InterceptorServiceProvider } from './core/services/interceptor.service.provider';

import { CustomSerializer } from './reducers';
import { CustomRouteReuseStrategy } from './customReuseRouteStrategy';
import { RouteReuseStrategy } from '@angular/router';



@NgModule({
    imports: [
        BrowserModule,
        NgbModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        TreeModule.forRoot(),
        StoreModule.forRoot(reducers, {
            metaReducers,
            runtimeChecks: {
                strictStateImmutability: true,
                strictActionImmutability: true,
            },
        }),
        EffectsModule.forRoot([]),
        StoreRouterConnectingModule.forRoot({ 
            stateKey : 'router',
            serializer: CustomSerializer
        }),
        StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production, // Restrict extension to log-only mode
        }),
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        HeaderComponent,
        LoginComponent,
        LoginBranchComponent,
        ContactComponent,
        LoadingScreenComponent
    ],
    providers: [
        GlobalService,
        LoginService,
        LoadingScreenService,
        InterceptorServiceProvider,
        {
            provide: RouteReuseStrategy,
            useClass: CustomRouteReuseStrategy
        }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
