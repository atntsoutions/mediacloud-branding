import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { User } from '../models/user';
import { Userd } from '../models/userd';

import { UserService } from '../services/user.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Companym } from '../../core/models/company';




@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    providers: [UserService]
})
export class UserComponent {
    /*
    Ajith 19/06/2019 Page row increase to 50,server det added in list
    */
    // Local Variables 

    @Input() menuid: string = '';
    @Input() type: string = '';



    InitCompleted: boolean = false;
    menu_record: any;

    canSave = false;
    showBranches = false;

    title = 'USER MASTER';
    loading = false;
    currentTab = 'LIST';

    role = "";

    showall =false;
    mrole = "ALL";
    searchstring = '';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    bsadmin = false;
    bzadmin = false;
    bsman = false;
    bvendor = false;
    brecce = false;

    sub: any;
    urlid: string;

    ErrorMessage = "User Details";

    mode = '';
    pkid = '';

    // Array For Displaying List
    RecordList: User[] = [];
    // Single Record for add/edit/view details
    Record: User = new User;

    NewDefaultRecord: User = new User;

    RecordDet: Userd[] = [];

    role_where = '';
    region_where = "";

    constructor(
        private mainService: UserService,
        private location: Location,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 50;
        this.page_current = 0;

        this.role =  this.gs.globalVariables.user_role_name;
        this.menuid = this.gs.getParameter('menuid');
        this.type = this.gs.getParameter('type');

        this.InitComponent();
    }



    InitComponent() {
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
        }

        this.bsadmin =true; this.bzadmin =true; this.bsman =true; this.bvendor =true; this.brecce = true;

        if ( this.role == "SUPER ADMIN") {
            this.bsadmin =true; this.bzadmin =true; this.bsman =true; this.bvendor =true; this.brecce = true;
        }

        if ( this.role == "ZONE ADMIN") {
            this.bsadmin =false; this.bzadmin =false; this.bsman =true; this.bvendor =true; this.brecce = true;
            this.role_where = " param_name in('SALES EXECUTIVE', 'VENDOR', 'RECCE USER')";
            this.region_where  = " param_pkid = '" + this.gs.globalVariables.user_region_id + "'"; 
        }
        if ( this.role == "SALES EXECUTIVE") {
            this.bsadmin =false; this.bzadmin =false; this.bsman =false; this.bvendor =true; this.brecce = true;
        }
        if ( this.role == "VENDOR"){
            this.bsadmin =false; this.bzadmin =false; this.bsman =false; this.bvendor =false; this.brecce = true;
            this.role_where = " param_name in('RECCE USER')";
        }
        if ( this.role == "RECCE USER") {
            this.bsadmin =false; this.bzadmin =false; this.bsman =false; this.bvendor =false; this.brecce = false;
        }

        if( this.role == "VENDOR")
            this.NewUserDefault();
        this.List("NEW");
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
        else if (action === 'ADD') {
            this.currentTab = 'DETAILS';
            this.mode = 'ADD';
            this.NewRecord();
            this.resetRights();
        }
        else if (action === 'EDIT') {
            this.currentTab = 'DETAILS';
            this.mode = 'EDIT';
            this.pkid = id;
            this.GetRecord(id);
            this.resetRights();
        }
    }

    resetRights() {
        this.canSave = false;
        if (this.mode == "ADD" && this.menu_record.rights_add)
            this.canSave = true;
        if (this.mode == "EDIT" && this.menu_record.rights_edit)
            this.canSave = true;
    }

    // Query List Data
    List(_type: string) {

        this.loading = true;

        let SearchData = {
            type: _type,
            searchstring: this.searchstring.toUpperCase(),
            mrole: this.mrole,
            showall : this.showall,
            comp_code: this.gs.globalVariables.comp_code,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount,
            rights_admin: this.menu_record.rights_admin,
            user_pkid: this.gs.globalVariables.user_pkid,
            user_admin : this.gs.globalVariables.user_admin,
            vendor_id : this.gs.globalVariables.user_vendor_id,
            region_id : this.gs.globalVariables.user_region_id,
            role_id : this.gs.globalVariables.user_role_id,      
            role_name : this.gs.globalVariables.user_role_name,
            role_rights_id : this.gs.globalVariables.user_role_rights_id,                  
        };

        this.ErrorMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
                this.page_count = response.page_count;
                this.page_current = response.page_current;
                this.page_rowcount = response.page_rowcount;
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }



    NewRecord() {

        this.pkid = this.gs.getGuid();

        this.Record = new User();
        this.Record.user_pkid = this.pkid;
        this.Record.user_code = '';
        this.Record.user_name = '';

        this.Record.user_parent_id = '';
        this.Record.user_parent_name = '';

        this.Record.user_password = '';
        this.Record.user_email = '';
        this.Record.user_sman_id = '';
        this.Record.user_sman_code = '';
        this.Record.user_sman_name = '';
        this.Record.user_email_pwd = '';
        this.Record.user_local_server = '';

        this.Record.user_role_id = '';
        this.Record.user_role_name = '';
        this.Record.user_role_rights_id = '';

        this.Record.user_region_id = '';
        this.Record.user_region_name = '';

        this.Record.user_vendor_id = '';
        this.Record.user_vendor_name = '';

        this.Record.user_islocked =false;

        this.Record.rec_mode = this.mode;
        this.Record.user_branch_user = false;


        this.showBranches = false;

        if ( this.role == "VENDOR") {

            this.Record.user_parent_id = this.gs.globalVariables.user_pkid;
            this.Record.user_parent_name = this.gs.globalVariables.user_name;

            this.Record.user_role_id = this.NewDefaultRecord.user_role_id ;
            this.Record.user_role_name = this.NewDefaultRecord.user_role_name ;
            this.Record.user_role_rights_id = this.NewDefaultRecord.user_role_id ;

            this.Record.user_region_id = this.NewDefaultRecord.user_region_id ;
            this.Record.user_region_name = this.NewDefaultRecord.user_region_name ;

            this.Record.user_vendor_id = this.NewDefaultRecord.user_vendor_id ;
            this.Record.user_vendor_name = this.NewDefaultRecord.user_vendor_name ;

        }

    }


    NewUserDefault() {
    
        let SearchData = {
            pkid: this.gs.globalVariables.user_pkid,
            comp_code: this.gs.globalVariables.comp_code,
            role_name: this.role,
            comp_id: this.gs.globalVariables.comp_pkid
        };

        this.ErrorMessage = '';
        this.mainService.NewUserDefault(SearchData)
            .subscribe(response => {
                this.NewDefaultRecord = response.record;

            },
            error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
            });
    }




    // Load a single Record for VIEW/EDIT
    GetRecord(Id: string) {
        this.loading = true;

        let SearchData = {
            pkid: Id,
            comp_id: this.gs.globalVariables.comp_pkid
        };

        this.ErrorMessage = '';
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                


                this.loading = false;
                this.LoadData(response.record);
                this.RecordDet = response.recorddet;
                if (this.RecordDet.length > 0)
                    this.showBranches = true;
                if (this.menu_record.rights_admin == false)
                    this.showBranches = false;


            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    LoadData(_Record: User) {
        this.Record = _Record;
        this.Record.rec_mode = this.mode;
    }

    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';

        this.Record.RecordDet = this.RecordDet;

        this.Record._globalvariables = this.gs.globalVariables;

        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.ErrorMessage = "Save Complete";
                this.mode = 'EDIT';
                this.Record.rec_mode = this.mode;
                this.RefreshList();
                this.resetRights();
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert( this.ErrorMessage);

                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        if (this.Record.user_code.trim().length <= 0) {
            bret = false;
            sError = "Code Cannot Be Blank";
        }
        if (this.Record.user_name.trim().length <= 0) {
            bret = false;
            sError += "\n\rName Cannot Be Blank";
        }

        //if (this.Record.user_password.trim().length <= 0) {
        //    bret = false;
        //    sError += "\n\rPassword Cannot Be Blank";
        //}

        if (bret) {
            this.Record.user_code = this.Record.user_code.toUpperCase().replace(' ', '');
            this.Record.user_name = this.Record.user_name.toUpperCase().trim();
            this.Record.user_password = this.Record.user_password.toUpperCase().trim();
        }

        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;

        var REC = this.RecordList.find(rec => rec.user_pkid == this.Record.user_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.user_code = this.Record.user_code;
            REC.user_name = this.Record.user_name;
            REC.user_email = this.Record.user_email;
            REC.user_sman_name = this.Record.user_sman_name;
            REC.user_parent_name = this.Record.user_parent_name;
        }
    }

    Close() {
        this.gs.ClosePage('home');
    }

}
