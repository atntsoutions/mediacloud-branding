import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';

import { SearchTable } from '../../shared/models/searchtable';

import { PimJobService } from '../services/pimjob.service';
import { pim_spot, pim_spot_model } from '../models/pim_spot';



@Component({
  selector: 'app-pimrecce',
  templateUrl: './pimrecce.component.html'
})
export class PimRecceComponent {
  // Local Variables 

  title = 'Job';

  tab = 'LIST';

  imageFileName ="";

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() table_name: string = '';
  
  @Input() showHeading: boolean = true;


  private _parentid: string = '';
  @Input() set parentid(value: string) {
    if (value != null) {
      this._parentid = value;
      this.GetRecord( this._parentid);
    }

  }



  report_title: string = '';
  report_url: string = '';
  report_searchdata: any = {};
  report_menuid: string = '';


  canSave = false;

  pkid = '';

  selectedRowIndex: number = -1;
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;

  isAdmin = false;
  bChanged: boolean;

  urlid: string;

  store_region_where = "";
  vendor_where = "";

  bApproval = false;

  user_pkid = '';


  Record : pim_spot ;

  recce_id  = '';
  recce_code  = '';
  recce_name  = '';

  constructor(
    private modalService: NgbModal,
    public ms: PimJobService,
    private route: ActivatedRoute,
    public gs: GlobalService
  ) {

    this.menuid = this.gs.getParameter("menuid");
    this.type = this.gs.getParameter("type");
    this.urlid = "1001";

    this.InitComponent();

    this.Record = new pim_spot();
    this.Record.spot_recce_id = '';
    this.Record.spot_recce_name= '';


  }

  ngOnInit() {
  }

  InitComponent() {
    this.isAdmin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;

      if (this.menu_record.rights_admin) {
        this.isAdmin = true;
      }

    }

    this.user_pkid = this.gs.globalVariables.user_pkid;  

    this.vendor_where = " a.user_vendor_id ='" + this.gs.globalVariables.user_vendor_id + "'";


  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
  }


  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {


    alert(Id);

    let SearchData = {
      pkid: this.parentid,
      comp_code : this.gs.globalVariables.comp_code
    };


    
    

    this.ms.getRecord_recce_user(SearchData)
      .subscribe(response => {

        this.Record.spot_recce_id = response.record.spot_recce_id;
        this.Record.spot_recce_name = response.record.spot_recce_name;

        this.resetRights();
      },
        error => {
          alert(this.gs.getError(error));
        });
  }
  


  NewRecord() {
    this.resetRights()

  }


  resetRights() {
    if (!this.menu_record)
      return;
  }


  Save() {

    //if (!this.allvalid())
    //return;
    
    this.Record._globalvariables = this.gs.globalVariables;

    this.ms.Save_recce_user(this.Record).subscribe(
      response => {
        alert('Save Complete');
      },
      error => {
        alert(this.gs.getError(error));
      }
    )
  }



}

