import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PimGrpComponent } from './group/pimgrp.component';
import { PimDocComponent } from './main/pimdoc.component';
import { PimJobComponent } from './spot/pimjob.component';
import { PimSpotComponent } from './spot/pimspot.component';

const routes: Routes = [
    {path : 'pimgrp', component : PimGrpComponent },
    {path : 'pim', component : PimDocComponent },
    {path : 'spot', component : PimSpotComponent },
    {path : 'job', component : PimJobComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class PimRoutingModule {
}
