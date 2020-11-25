import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';

import { SearchTable } from '../../shared/models/searchtable';

import { mailhistory } from '../../shared/models/mailhistory';

import { PimSpotService } from '../services/pimspot.service';
import { pim_spot, pim_spotd, pim_spot_model } from '../models/pim_spot';




@Component({
  selector: 'app-pimspot',
  templateUrl: './pimspot.component.html'
})
export class PimSpotComponent {
  // Local Variables 

  title = 'Spot Registration';

  tab = 'LIST';

  imageFileName ="";

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() table_name: string = '';
  @Input() parentid: string = '';
  @Input() showHeading: boolean = true;


  edit_recce_id = '';
  show_recce_window = false;

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


  maildata : mailhistory;

  isAdmin = false;
  bChanged: boolean;

  urlid: string;
  data: pim_spot_model;

  

  bApproval = false;

  constructor(
    private modalService: NgbModal,
    public ms: PimSpotService,
    private route: ActivatedRoute,
    public gs: GlobalService
  ) {

    this.menuid = this.gs.getParameter("menuid");
    this.type = this.gs.getParameter("type");
    this.urlid = "1001";

    this.maildata = new mailhistory();
    this.maildata.mail_process_id = 0;

    this.InitComponent();

  }

  ngOnInit() {
  }

  InitComponent() {
    this.isAdmin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      
      if (  this.menu_record.rights_approval)
        this.bApproval = true;

      if (this.menu_record.rights_admin) {
        this.isAdmin = true;
        this.bApproval = true;
      }
    }


    this.data = this.ms.init(this.urlid);

    this.resetRights();

    if (this.data.data_status == -1)
      this.List('NEW');

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
  }


  List(_type: string) {

    let SearchData = {
      type: _type,
      searchstring: this.data.searchString.toUpperCase(),
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      page_count: this.data.page_count,
      page_current: this.data.page_current,
      page_rows: this.data.page_rows,
      page_rowcount: this.data.page_rowcount,
      user_code: this.gs.globalVariables.user_code,
      user_id : this.gs.globalVariables.user_pkid,
      user_admin : this.gs.globalVariables.user_admin,
      vendor_id : this.gs.globalVariables.user_vendor_id,
      region_id : this.gs.globalVariables.user_region_id,
      role_id : this.gs.globalVariables.user_role_id,      
      role_name : this.gs.globalVariables.user_role_name,
      role_rights_id : this.gs.globalVariables.user_role_rights_id,      
    };

    this.data.ErrorMessage = '';
    this.data.InfoMessage = '';
    this.ms.List(SearchData)
      .subscribe(response => {
        this.data.RecordList = response.list;
        this.data.page_count = response.page_count;
        this.data.page_current = response.page_current;
        this.data.page_rowcount = response.page_rowcount;
      },
        error => {
          this.data.ErrorMessage = this.gs.getError(error);
        });
  }


  ActionHandler(action: string, id: string) {

    this.data.ErrorMessage = "";
    this.data.InfoMessage = "";
    
    if (action === 'LIST') {
      this.data.tab = 'LIST';
    }

    else if (action === 'ADD') {
      this.NewRecord();
    }


    if (action == 'EDIT') {
      this.data.pkid = id;
      this.data.tab = "DETAILS";
      this.GetRecord(id);
    }




  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {

    let SearchData = {
      pkid: Id,
      comp_code : this.gs.globalVariables.comp_code
    };

    this.data.ErrorMessage = '';
    this.ms.getRecord(SearchData)
      .subscribe(response => {
        this.data.Record = response.record;
        this.data.RecordDet = response.recorddet;

        this.data.mode = "EDIT";
        this.resetRights();
      },
        error => {
          this.data.ErrorMessage = this.gs.getError(error);
        });
  }



  


  NewRecord() {

    this.data.Record = new pim_spot();
  
    this.data.pkid = this.gs.getGuid();
    this.data.Record.spot_pkid = this.data.pkid;
    this.data.Record.spot_date = this.gs.defaultValues.today;

    this.data.Record.spot_store_id = "";
    this.data.Record.spot_store_name = "";
    
    this.data.Record.spot_vendor_id = "";
    this.data.Record.spot_vendor_name = "";

    this.data.Record.spot_region_id = "";
    this.data.Record.spot_region_name = "";

    this.data.Record.spot_executive_name = "";
    this.data.Record.spot_store_contact_name = "";
    this.data.Record.spot_store_contact_tel= "";

    this.data.Record.spot_store_view = "";
    this.data.Record.spot_store_view_file = null;
    this.data.Record.spot_store_view_file_uploaded = false;

    this.data.Record.spot_installation_view = "";
    this.data.Record.spot_installation_view_file = null;
    this.data.Record.spot_installation_view_file_uploaded = false;

    this.data.Record.spot_server_folder = "" ;


    this.data.tab = 'DETAILS';
    this.data.mode = 'ADD';

    this.data.RecordDet = [];

    this.resetRights()

  }


  resetRights() {
    this.canSave = false;
    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.canSave = true;
    if (this.data.mode == "ADD" && this.menu_record.rights_add)
      this.canSave = true;
    if (this.data.mode == "EDIT" && this.menu_record.rights_edit)
      this.canSave = true;
  }


  Save() {

    //if (!this.allvalid())
    //return;


    this.data.ErrorMessage = '';
    this.data.Record.rec_mode = this.data.mode;

    let frmData: FormData = new FormData();
    this.data.Record._globalvariables = this.gs.globalVariables;
    
    frmData.append("record", JSON.stringify(this.data.Record));

    if (this.data.Record.spot_store_view_file != null && this.data.Record.spot_store_view != "")
        frmData.append("storeview", this.data.Record.spot_store_view_file);

    if (this.data.Record.spot_installation_view_file != null && this.data.Record.spot_installation_view != "")
        frmData.append("installationview", this.data.Record.spot_installation_view_file);


    this.ms.Save(frmData).subscribe(
      response => {
  
        if ( this.data.mode == "ADD" ) {
          this.data.mode = "EDIT";
          this.data.Record.spot_slno = response.slno;
          this.data.RecordList.push(this.data.Record);
        }
        else {

          const item = this.data.RecordList.find(rec => rec.spot_pkid == this.data.Record.spot_pkid);
          if (item != null) {
            item.spot_store_name = this.data.Record.spot_store_name;
          }

        }
        alert('Save Complete');
      },
      error => {
        this.data.ErrorMessage = this.gs.getError(error);
        alert(this.data.ErrorMessage);
      }
    )
  }


  saveDet(_Record : pim_spotd) {

    //if (!this.allvalid())
    //return;


    let frmData: FormData = new FormData();
    
    _Record._globalvariables = this.gs.globalVariables;
    
    frmData.append("record", JSON.stringify(_Record));

    if (_Record.spotd_close_view != null && _Record.spotd_close_view != "")
      frmData.append("closeview", _Record.spotd_close_view_file);

    if (_Record.spotd_long_view != null && _Record.spotd_long_view != "")
      frmData.append("longview", _Record.spotd_long_view_file);

    if (_Record.spotd_final_view != null && _Record.spotd_final_view != "")
      frmData.append("finalview", _Record.spotd_final_view_file);      



    this.ms.SaveDet(frmData).subscribe(
      response => {
  
        if ( _Record.rec_mode == "ADD" ) {
          _Record.rec_mode = "EDIT";
          _Record.spotd_slno = response.slno;
        }
        alert('Save Complete');
      },
      error => {
        alert( this.gs.getError(error));
      }
    )
  }

  AddSpot(){
    let bok = true;
    this.data.RecordDet.forEach(rec =>{
      if (rec.spotd_slno == 0 )
        bok = false;
    });
    if (!bok )
    {
      alert('please save any added spot details');
      return;
    }

    let rec : pim_spotd  = new pim_spotd();
    rec.spotd_pkid = this.gs.getGuid();  
    rec.spotd_parent_id = this.data.Record.spot_pkid;
 
    rec.spotd_slno = 0;
    rec.spotd_name = "";
    rec.spotd_uom = "CM";
    rec.spotd_artwork_id = "";
    rec.spotd_product_id = "";

    rec.spotd_close_view = "";
    rec.spotd_close_view_file = null;
    rec.spotd_close_view_file_uploaded = false;

    rec.spotd_long_view = "";
    rec.spotd_long_view_file = null;
    rec.spotd_long_view_file_uploaded = false;

    rec.spotd_final_view = "";
    rec.spotd_final_view_file = null;
    rec.spotd_final_view_file_uploaded = false;    

    rec.rec_mode = "ADD"; 
    this.data.RecordDet.push(rec);
  }


  remove(rec: pim_spot) {
    if (confirm("Are you sure to delete " + rec.spot_slno)) {

      let SearchData = {
        pkid: rec.spot_pkid,
        comp_code: this.gs.globalVariables.comp_code
      };
      this.ms.delete(SearchData)
        .subscribe(response => {
          this.data.RecordList = this.data.RecordList.filter(r => r.spot_pkid != rec.spot_pkid);
          
          alert('Record Removed');
        },
          error => {
            alert(this.gs.getError(error));
          });
    }

  }

  deleteDet(id : string) {

    if (confirm("Are you sure to delete ")) {

      let SearchData = {
        pkid: id,
        parentid : this.data.pkid,
        comp_code: this.gs.globalVariables.comp_code
      };
      this.ms.deleteDet(SearchData)
        .subscribe(response => {
          this.data.RecordDet = this.data.RecordDet.filter(r => r.spotd_pkid != id);
          this.data.RecordDet.forEach( (elm : pim_spotd, idx  )=> {
            elm.spotd_slno =  idx + 1;
          });
          alert('Record Removed');
        },
          error => {
            alert(this.gs.getError(error));
          });
    }

  }

  requestApproval(){
    
  }

  Print(){

    let SearchData = {
      pkid: this.data.pkid,
      comp_code : this.gs.globalVariables.comp_code
    };

    this.data.ErrorMessage = '';
    this.ms.getSpotMemo(SearchData).subscribe(response => {
      //this.gs.DownloadFile('',response.filename, response.filetype, response.filedisplayname);
      this.data.report.filename =  response.filename;
      this.data.report.filetype = response.filetype; 
      this.data.report.filedisplayname = response.filedisplayname;
      this.data.tab = 'REPORT';
    },error => {
          this.data.ErrorMessage = this.gs.getError(error);
    });
  }

  Close() {
    this.gs.ClosePage('home');
  }

  getTimeStamp(){
    return '?t=' + new Date().getTime();
  }


  Print1() {

        this.report_title = 'Spot Details';
        this.report_url = '/api/Pim/Spot/SpotMemo';
        this.report_searchdata.pkid =  this.data.pkid;
        this.report_searchdata.comp_code = this.gs.globalVariables.comp_code;
        this.data.tab = 'REPORT';

  }

  getMailData(evt : any)
  {
    if ( evt  =="SEND"){
      this.maildata.mail_process_id = 0;
    }
    else  {
    var mdata = new mailhistory;
    mdata.mail_pkid = this.gs.getGuid();
    mdata.mail_source = "SPOT";
    mdata.mail_source_id = this.data.pkid ;
    mdata.mail_send_by = this.gs.globalVariables.user_code;
    mdata.mail_send_to ="";
    mdata.mail_refno =  "JOB# "+this.data.Record.spot_slno;
    mdata.mail_comments = "Mail Sent";
    mdata.mail_files = "";
    mdata.mail_date = "";
    mdata.mail_process_id = 1;
    this.maildata = mdata;
    }
  }

  callbackevent(event: any) {
    this.data.tab = 'DETAILS';
  }


  showRecce(content : any, rec : pim_spot ){
    this.edit_recce_id = rec.spot_pkid ;
    this.modalService.open(content, { centered: true });
  }


  modalCallbackEvent(event: any) {
    let rec  = this.data.RecordList.find( rec  => rec.spot_pkid == event.parentid) as pim_spot;
    if (rec) {
      rec.spot_recce_name = event.name;
    }
    this.modalService.dismissAll(null);
  }


}

