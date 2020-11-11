import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { MasterRoutingModule } from './master.routing.module';

import { MasterComponent } from './master.component';
import { ParamComponent } from './param/param.component';

import { SettingsComponent } from './settings/settings.component';
import { TablesmComponent } from './tablesm/tablesm.component';

@NgModule({
  imports: [
    SharedModule,
    MasterRoutingModule
  ],
  declarations: [
    MasterComponent,
    ParamComponent,
    SettingsComponent,
    TablesmComponent
  ],
  providers: [
  ],
})
export class MasterModule { }
