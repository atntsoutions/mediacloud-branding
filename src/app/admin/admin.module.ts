import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { AdminRoutingModule } from './admin.routing.module';

import { AdminComponent } from './admin.component';
import { UserComponent } from './user/user.component';
import { CompanyComponent } from './company/company.component';
import { MenuComponent } from './menu/menu.component';
import { ModuleComponent } from './module/module.component';
import { RightsComponent } from './rights/rights.component';
import { UserStoreComponent } from './user/userstore/userstore.component';


import { CampaignComponent } from './campaign/campaign.component';

@NgModule({
    imports: [
        SharedModule, 
        AdminRoutingModule
    ],
    declarations: [
        AdminComponent,
        UserComponent,
        CompanyComponent,
        MenuComponent,
        ModuleComponent,
        RightsComponent,
        UserStoreComponent,
        CampaignComponent
   ],
    providers: [
    ],
})
export class AdminModule { }
