import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParamComponent } from './param/param.component';
import { SettingsComponent } from './settings/settings.component';
import { TablesmComponent } from './tablesm/tablesm.component';


const routes: Routes = [
    { path: 'param', component: ParamComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'tablesm', component: TablesmComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class MasterRoutingModule {
}
