import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../../core/services/global.service';

import { User } from '../../models/user';
import { Userd } from '../../models/userd';

import { UserService } from '../../services/user.service';
import { SearchTable } from '../../../shared/models/searchtable';

import { Companym } from '../../models/company';




@Component({
    selector: 'app-userstore',
    templateUrl: './userstore.component.html',
    providers: [UserService]
})
export class UserStoreComponent {
    /*
    Ajith 19/06/2019 Page row increase to 50,server det added in list
    */
    // Local Variables 

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() pkid: string = '';

    InitCompleted: boolean = false;
    menu_record: any;

    canSave = false;
    showBranches = false;

    title = 'INCLUDE/EXCLUDE STORE';
    loading = false;
    currentTab = 'LIST';


    searchstring = '';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;


    sub: any;
    urlid: string;

    ErrorMessage = "User Details";

    mode = '';


    // Array For Displaying List
    RecordList: Companym[] = [];
    // Single Record for add/edit/view details
    Record: Companym = new Companym;



    constructor(
        private mainService: UserService,
        private location: Location,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 15;
        this.page_current = 0;

        this.InitComponent();
    }

    InitComponent() {
        this.currentTab = 'LIST';
    }

    // Init Will be called After executing Constructor
    ngOnInit() {

    }
    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }



    LovSelected(_Record: SearchTable) {
    }

    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.ErrorMessage = '';
        if (action == 'LIST') {
            this.mode = '';
            this.pkid = '';
            this.currentTab = 'LIST';
        }
    }

    // Query List Data
    List(_type: string) {

        this.loading = true;

        let SearchData = {
            type: _type,
            searchstring: this.searchstring.toUpperCase(),
            comp_code: this.gs.globalVariables.comp_code,
            row_type: 'S',
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount,
            user_pkid: this.gs.globalVariables.user_pkid,
            userid: this.pkid,
            user_admin : this.gs.globalVariables.user_admin,
            vendor_id : this.gs.globalVariables.user_vendor_id,
            region_id : this.gs.globalVariables.user_region_id,
            role_id : this.gs.globalVariables.user_role_id,      
            role_name : this.gs.globalVariables.user_role_name,
            role_rights_id : this.gs.globalVariables.user_role_rights_id,                  
        };

        this.ErrorMessage = '';
        this.mainService.LoadUserStore(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
                this.page_count = response.page_count;
                this.page_current = response.page_current;
                this.page_rowcount = response.page_rowcount;
            }, error => {
                this.loading = false;
                this.ErrorMessage = this.gs.getError(error);
            });
    }



    // Save Data
    Save(rec : Companym) {

        this.loading = true;
        this.ErrorMessage = '';

        this.Record = rec;
        this.Record.user_id = this.pkid;
        this.Record._globalvariables = this.gs.globalVariables;

        this.mainService.SaveUserStore(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.ErrorMessage = "Save Complete";
                this.mode = 'EDIT';
                this.Record.rec_mode = this.mode;

            }, error => {
                this.loading = false;
                this.ErrorMessage = this.gs.getError(error);

            });
    }


}
