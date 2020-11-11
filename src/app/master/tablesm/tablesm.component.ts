import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { tablesm } from '../models/tablesm';
import { TablesService } from '../services/tables.service';
import { tablesd } from 'src/app/pim/models/tablesm';


@Component({
  selector: 'app-tablesm',
  templateUrl: './tablesm.component.html'
})
export class TablesmComponent {
  /*Ajith 19/06/2019 LOcked TAN Enabled*/
  //Local Variables 
  title = 'Tablesm';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  canSave =false;

  selectedRowIndex: number = -1;



  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  sortby: boolean = false;
  bPrint = false;

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
  RecordList: tablesm[] = [];
  // Single Record for add/edit/view details
  Record: tablesm = new tablesm;


  ColumnList: tablesd[] = [];

  constructor(
    private mainService: TablesService,
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

  // Init Will be called After executing Constructor
  ngOnInit() {
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
    this.List("NEW");
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
      this.ResetControls();
      this.NewRecord();
    }
    else if (action === 'EDIT') {
      this.selectedRowIndex = _selectedRowIndex;
      this.currentTab = 'DETAILS';
      this.mode = 'EDIT';
      this.ResetControls();
      this.pkid = id;
      this.GetRecord(id);
    }
  }


  ResetControls() {
    this.canSave =  false;
    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.canSave = true;
    if (this.menu_record.rights_add)
      this.canSave = true;
    if (this.menu_record.rights_edit)
      this.canSave = true;

  }

  // Query List Data
  List(_type: string) {

    this.loading = true;
    this.selectedRowIndex = -1;

    let SearchData = {
      type: _type,
      searchstring: this.searchstring.toUpperCase(),
      comp_code: this.gs.globalVariables.comp_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount
    };

    this.ErrorMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
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

    this.Record = new tablesm();
    this.Record.tab_pkid = this.pkid;


    this.Record.tab_name = '';
    this.Record.tab_caption = '';

    this.Record.tab_id = '';
    this.Record.tab_store  ='';
    this.Record.tab_group = '';
    this.Record.tab_sku = '';
    this.Record.tab_file = '';

    this.Record.tab_sku_duplication  = true;
    this.Record.tab_store_duplication  = true;
    this.Record.tab_campaign_table = false;

    this.Record.rec_mode = this.mode;


    this.ColumnList = [];

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
        this.Record = response.record;
        this.ColumnList = response.records;
        this.Record.rec_mode = this.mode;

      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
        });
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
        this.Record.tab_table_name = response.table_name;
        this.Record.rec_mode = this.mode;
        this.RefreshList();
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
    
    if (this.Record.tab_name.trim().length <= 0) {
      bret = false;
      sError = "Table Name Cannot Be Blank";
    }

    if (this.Record.tab_caption.trim().length <= 0) {
      bret = false;
      sError += "\n\rCaption Cannot Be Blank";
    }
    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }


  DeleteTable(Rec : tablesm){

    var conf = confirm("Confirm Delete Y/N");
    if ( !conf)
      return;


    let SearchData = {
      pkid: Rec.tab_pkid,
      comp_code : this.gs.globalVariables.comp_code,
      table_name : Rec.tab_table_name,
    };

    this.ErrorMessage = '';
    this.mainService.DeleteTable(SearchData)
      .subscribe(response => {
        if (response.flag) {
          this.RecordList.forEach ( (itm,index) =>{
            if ( itm.tab_pkid == Rec.tab_pkid)
              this.RecordList.splice(index,1);
          })
        }

      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
        });


  }



  RefreshList() {

    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.tab_pkid == this.Record.tab_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.tab_name = this.Record.tab_name;
      REC.tab_table_name = this.Record.tab_table_name;
      REC.tab_caption = this.Record.tab_caption;
    }
  }

  Close() {
    this.gs.ClosePage('home');
  }



  AddColumn() {

    let rec = new tablesd();
    rec.tabd_pkid = this.gs.getGuid();
    rec.tabd_parent_id = this.pkid;
    rec.tabd_tab_name = this.Record.tab_name;
    rec.tabd_table_name = this.Record.tab_table_name;
    rec.tabd_col_name = "";
    rec.tabd_col_caption = "";
    rec.tabd_col_type = "TEXT";
    rec.tabd_col_rows = 1;
    rec.tabd_col_len = 10;
    rec.tabd_col_dec = 0;
    rec.tabd_col_id = '';
    rec.tabd_col_value = '';
    rec.tabd_col_list = 'NA';
    rec.tabd_col_case = "N";
    rec.tabd_col_mandatory = "N";
    rec.rec_deleted = false;
    rec.rec_mode = "ADD";

    this.ColumnList.push(rec);

  }

  allvalid2(rec: tablesd) {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    if (rec.tabd_col_name.trim().length <= 0) {
      bret = false;
      sError = "Column Name Cannot Be Blank";
    }
    if (rec.tabd_col_caption.trim().length <= 0) {
      bret = false;
      sError += "\n\rCaption Cannot Be Blank";
    }
    if (rec.tabd_col_len <= 0) {
      bret = false;
      sError += "\n\rColumn Length Need to be entered";
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }
  // Save Data
  SaveDetail(Rec: tablesd) {

    if (!this.allvalid())
      return;


    Rec.tabd_col_name = Rec.tabd_col_name.trim().toUpperCase();
    Rec._globalvariables = this.gs.globalVariables;

    this.ErrorMessage = '';

    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.SaveDetail(Rec)
      .subscribe(response => {
        this.ErrorMessage = "Save Complete";
        if ( Rec.rec_mode == 'ADD')
          Rec.tabd_col_order = response.iorder;
        Rec.rec_mode = 'EDIT';
        Rec.tabd_col_name = response.col_name;
        
      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  DeleteDetail(Rec: tablesd) {

    var conf = confirm("Confirm Delete Y/N");
    if ( !conf)
      return;


    let SearchData = {
      pkid: Rec.tabd_pkid,
      table_name : this.Record.tab_table_name,
      col_name: Rec.tabd_col_name,
      
    };

    this.ErrorMessage = '';
    this.mainService.DeleteDetail(SearchData)
      .subscribe(response => {
        if (response.flag) {
          this.ColumnList.forEach ( (itm,index) =>{
            if ( itm.tabd_pkid == Rec.tabd_pkid)
              this.ColumnList.splice(index,1);
          })
        }

      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
        });

  }



}
