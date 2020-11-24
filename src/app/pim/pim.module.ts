import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { PimRoutingModule } from './pim.routing.module';
import { PimGrpComponent } from './group/pimgrp.component';
import { PimDocComponent } from './main/pimdoc.component';
import { PimSpotComponent } from './spot/pimspot.component';
import { PimSpotDetComponent } from './spot/pimspotdet.component';
import { PimJobComponent } from './spot/pimjob.component';
import { PimRecceComponent } from './recce-user/pimrecce.component';



@NgModule({
  imports: [
    SharedModule,
    PimRoutingModule
  ],
  declarations: [
    PimGrpComponent,
    PimDocComponent,
    PimSpotComponent,
    PimSpotDetComponent,
    PimJobComponent,
    PimRecceComponent
  ],
  providers: [
  ],
})
export class PimModule { }
