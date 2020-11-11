import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Param } from '../models/param';
import { ParamService } from '../services/param.service';

@Component({
  selector: 'app-param',
  templateUrl: './param.component.html'
})
export class ParamComponent {
  /*Ajith 19/06/2019 LOcked TAN Enabled*/
  //Local Variables 
  title = 'Param MASTER';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  canSave = false;

  selectedRowIndex: number = -1;

  param_rate_caption: string = '';

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  sortby: boolean = false;
  bPrint = false;

  showcode = false;

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  is_file_upload = false;

  sub: any;
  urlid: string;

  id1: string = '';
  id2: string = '';
  id3: string = '';
  id4: string = '';

  email: string = '';


  ErrorMessage = "";

  mode = '';
  pkid = '';

  code_length: number = 50;

  tablename = '';
  ParamList: Param[] = [];


  // Array For Displaying List
  RecordList: Param[] = [];
  // Single Record for add/edit/view details
  Record: Param = new Param;

  constructor(
    private mainService: ParamService,
    private route: ActivatedRoute,
    public gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 10;
    this.page_current = 0;
    this.menuid = this.gs.getParameter('menuid');
    this.type = this.gs.getParameter('type');
    this.InitComponent();
    this.LoadCombo();
  }

  InitComponent() {
    this.bPrint = false;
    this.currentTab = 'LIST';
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_print)
        this.bPrint = true;
    }
    this.InitColumns();
  }


  // Init Will be called After executing Constructor
  ngOnInit() {
  }

  LoadCombo() {

    if (this.type == 'TABLES') {
      const p1 = new Param
      p1.param_pkid = 'TABLES';
      p1.param_name = 'TABLES';
      this.ParamList.push(p1);
      this.tablename = 'TABLES';
      this.List('NEW');
      return;

    }

    let SearchData = {
      comp_code: this.gs.globalVariables.comp_code,
      table: 'PARAM',
      'param_type': 'TABLES'
    }

    this.mainService.Lov(SearchData).subscribe(
      response => {
        this.ParamList = response.param;
        if (this.ParamList.length > 0) {
          this.tablename = this.ParamList[0].param_name;

          this.List('NEW');
        }
      },
      error => {
        this.ErrorMessage = this.gs.getError(error);
      }
    );
  }


  
  InitColumns() {

    this.id1 = '';
    this.id2 = '';
    this.id3 = '';
    this.id4 = '';

    this.email = '';

    this.code_length = 50;
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string, _selectedRowIndex: number = -1) {
    this.ErrorMessage = '';
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
      this.currentTab = 'LIST';
    }
    else if (action === 'ADD') {
      this.currentTab = 'DETAILS';
      this.mode = 'ADD';
      this.resetRights()
      this.NewRecord();
    }
    else if (action === 'EDIT') {
      this.selectedRowIndex = _selectedRowIndex;
      this.currentTab = 'DETAILS';
      this.mode = 'EDIT';
      this.resetRights()
      this.pkid = id;
      this.GetRecord(id);
    }
  }


  resetRights() {
    this.canSave = false;
    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.canSave = true;
    if (this.mode == "ADD" && this.menu_record.rights_add)
      this.canSave = true;
    if (this.mode == "EDIT" && this.menu_record.rights_edit)
      this.canSave = true;
  }

  // Query List Data
  List(_type: string) {

    this.loading = true;
    this.selectedRowIndex = -1;

    let SearchData = {
      type: _type,
      rowtype: this.tablename,
      searchstring: this.searchstring.toUpperCase(),
      sortby: '',
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount
    };

    SearchData.sortby = "name";
    if (this.sortby)
      SearchData.sortby = "code";

    this.ErrorMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.RecordList = response.list;
          this.page_count = response.page_count;
          this.page_current = response.page_current;
          this.page_rowcount = response.page_rowcount;
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
  NewRecord() {

    this.is_file_upload = false;

    this.pkid = this.gs.getGuid();

    this.Record = new Param();
    this.Record.param_pkid = this.pkid;
    this.Record.param_code = '';
    this.Record.param_name = '';
    this.Record.param_id1 = '';
    this.Record.param_id2 = '';
    this.Record.param_id3 = '';
    this.Record.param_id4 = '';
    this.Record.param_email = '';
    this.Record.param_rate = 0;
    this.Record.param_type = this.tablename;
    this.Record.rec_locked = false;
    this.Record.rec_mode = this.mode;

    this.Record.param_file_name  = "";
    this.Record.param_file = null;
    this.Record.param_file_uploaded = false;

  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id,
      comp_code : this.gs.globalVariables.comp_code
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

  LoadData(_Record: Param) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;

    this.is_file_upload = false;
    if ( this.tablename == 'ARTWORK'){
      this.is_file_upload = true;
    }

  }


  // Save Data
  Save() {
    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';

    this.Record._globalvariables = this.gs.globalVariables;


    let frmData: FormData = new FormData();

    frmData.append("record", JSON.stringify(this.Record));


    if (this.Record.param_file != null && this.Record.param_file_name != "")
      frmData.append("default", this.Record.param_file);


    this.mainService.Save(frmData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;

        this.Record.param_slno =  response.slno;
        

        if ( this.tablename == 'ARTWORK'){
          this.is_file_upload = true;
        }

        this.RefreshList();
        this.resetRights()
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);

        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';


    if (this.Record.param_name.trim().length <= 0) {
      bret = false;
      sError += "\n\rName Cannot Be Blank";
    }
    this.Record.param_code = this.Record.param_code.toUpperCase().trim();

    if( this.Record.param_type == "TABLES")
      this.Record.param_name = this.Record.param_name.toUpperCase().trim();



    //if (this.Record.user_password.trim().length <= 0) {
    //    bret = false;
    //    sError += "\n\rPassword Cannot Be Blank";
    //}

    if (bret) {
      this.Record.param_code = this.Record.param_code.toUpperCase().replace(' ', '');
      //this.Record.param_name = this.Record.param_name.toUpperCase().trim();

    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }


  Isnumeric(i: any) {

    if (i >= 0 && i <= 9) {
      return true;
    }
    else {
      return false;
    }

  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.param_pkid == this.Record.param_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.param_code = this.Record.param_code;
      REC.param_name = this.Record.param_name;
      REC.param_id1 = this.Record.param_id1;
      REC.param_id2 = this.Record.param_id2;
      REC.param_id3 = this.Record.param_id3;
      REC.param_id4 = this.Record.param_id4;
      REC.param_email = this.Record.param_email;
      REC.param_rate = this.Record.param_rate;

    }
  }

  Close() {
    this.gs.ClosePage('home');
  }


}
