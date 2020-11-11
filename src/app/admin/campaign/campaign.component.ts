import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Campaign } from '../models/campaign';

import { CampaignService } from '../services/campaign.service';

@Component({
    selector: 'app-campaign',
    templateUrl: './campaign.component.html',
    providers: [CampaignService]
})
export class CampaignComponent {
    // Local Variables 
    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;
    canSave = false;


    title = 'Campaign';
    loading = false;
    currentTab = 'LIST';

    searchstring = '';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;


    ErrorMessage = "";

    mode = '';
    pkid = '';

    // Array For Displaying List
    RecordList: Campaign[] = [];
    // Single Record for add/edit/view details
    Record: Campaign = new Campaign;

    constructor(
        private mainService: CampaignService,
        private location: Location,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 10;
        this.page_current = 0;


        this.menuid = this.gs.getParameter('menuid');
        this.type = this.gs.getParameter('type');
        this.InitComponent();

    }

    InitComponent() {
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
        }


        this.List("NEW");
        this.currentTab = 'LIST';

    }



    // Init Will be called After executing Constructor
    ngOnInit() {

    }
    // Destroy Will be called when this component is closed
    ngOnDestroy() {

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
            rowtype: this.type,
            comp_code: this.gs.globalVariables.comp_code,
            searchstring: this.searchstring.toUpperCase(),
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount
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

        this.Record = new Campaign();
        this.Record.cam_pkid = this.pkid;
        this.Record.cam_name = '';

        this.Record.cam_tab_id = '';
        this.Record.cam_tab_name = '';

        this.Record.tab_campaign_table = false;

        this.Record.cam_type = '';

        this.Record.cam_store = '';
        this.Record.cam_product_name = '';
        this.Record.cam_product_name_values = '';

        this.Record.cam_size = '';
        this.Record.cam_size_values = '';
        this.Record.cam_aep = '';
        this.Record.cam_aep_values = '';
        this.Record.cam_output = '';
        this.Record.cam_output_values = '';

        this.Record.cam_approver = '';
        this.Record.cam_receiver = '';
        this.Record.cam_logo = '';
        this.Record.cam_image1 = '';
        this.Record.cam_image2 = '';
        this.Record.cam_image3 = '';
        this.Record.cam_image4 = '';
        this.Record.cam_image5 = '';

        this.Record.cam_text1 = '';
        this.Record.cam_text1_values = '';

        this.Record.cam_text2 = '';
        this.Record.cam_text2_values = '';

        this.Record.cam_text3 = '';
        this.Record.cam_text3_values = '';

        this.Record.cam_text4 = '';
        this.Record.cam_text4_values = '';

        this.Record.cam_text5 = '';
        this.Record.cam_text5_values = '';


        this.Record.rec_mode = this.mode;
    }

    // Load a single Record for VIEW/EDIT
    GetRecord(Id: string) {
        this.loading = true;

        let SearchData = {
            pkid: Id,
        };

        this.ErrorMessage = '';

        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.LoadData(response.record);
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    LoadData(_Record: Campaign) {
        this.Record = _Record;
        this.Record.rec_mode = this.mode;
    }


    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';

        this.Record._globalvariables = this.gs.globalVariables;
        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.ErrorMessage = "Save Complete";
                this.mode = 'EDIT';
                this.Record.rec_mode = this.mode;
                this.RefreshList();
                this.resetRights();
            }, error => {
                this.loading = false;
                this.ErrorMessage = this.gs.getError(error);
                alert(this.ErrorMessage);
            });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        if (this.Record.cam_name.trim().length <= 0) {
            bret = false;
            sError += "\n\rName Cannot Be Blank";
        }

        //if (this.Record.user_password.trim().length <= 0) {
        //    bret = false;
        //    sError += "\n\rPassword Cannot Be Blank";
        //}

        if (bret) {
        }

        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }


    RunCampaign() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';

        console.table( this.Record);

        this.Record._globalvariables = this.gs.globalVariables;

        this.Record.user_is_admin = (this.gs.globalVariables.user_admin  ) ? 'Y' : 'N';

        this.mainService.RunCampaign(this.Record)
            .subscribe(response => {
                this.loading = false;

                this.ErrorMessage = response.total + " Records Processed";
                alert( this.ErrorMessage);

            }, error => {
                this.loading = false;
                this.ErrorMessage = this.gs.getError(error);
                alert(this.ErrorMessage);
            });
    }


    ResetCampaign() {

        this.loading = true;
        this.ErrorMessage = '';


        this.Record._globalvariables = this.gs.globalVariables;

        this.Record.user_is_admin = (this.gs.globalVariables.user_admin  ) ? 'Y' : 'N';

        this.mainService.ResetCampaign(this.Record)
            .subscribe(response => {
                this.loading = false;

                this.ErrorMessage = response.total + " Records Procesed (Reset)";
                alert( this.ErrorMessage);

            }, error => {
                this.loading = false;
                this.ErrorMessage = this.gs.getError(error);
                alert(this.ErrorMessage);
            });
    }




    RefreshList() {

        if (this.RecordList == null)
            return;

        var REC = this.RecordList.find(rec => rec.cam_pkid == this.Record.cam_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.cam_name = this.Record.cam_name;
        }
    }

    remove(rec: Campaign) {
        if (confirm("Are you sure to delete " + rec.cam_name)) {

            let SearchData = {
                pkid: rec.cam_pkid
            };

            this.ErrorMessage = '';
            this.mainService.Delete(SearchData)
                .subscribe(response => {
                    this.List('NEW');
                },
                    error => {
                        this.loading = false;
                        this.ErrorMessage = this.gs.getError(error);
                    });
        }

    }


    Close() {
        this.gs.ClosePage('home');
    }

}
