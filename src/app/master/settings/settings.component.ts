import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Settings } from '../models/settings';
import { Lockingm } from '../models/settings';
import { Settings_VM } from '../models/settings';
import { ParamService } from '../services/param.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  providers: [ParamService]
})
export class SettingsComponent {
  // Local Variables 
  title = 'Settings';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  canSave = false;


  selectedRowIndex: number = -1;

  loading = false;
  currentTab = 'COMPANY';

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  modal: any;

  urlid: string;

  statedisabled: boolean = false;
  transfrTableName: string = '';

  ErrorMessage = "";

  mode = '';
  pkid = '';

  code_length: number = 10;


  no1: number = 1001;
  no2: number = 1001;

  // Array For Displaying List
  RecordList: Settings[] = [];
  // Single Record for add/edit/view details
  Record: Settings_VM = new Settings_VM;

  SaveList: Settings[] = [];
  _Record: Settings = new Settings;
  DataTransfrList: any[] = [];

  LockRecord: Lockingm = new Lockingm;


  // COMPANY SETTINGS


  CO_SERVER_URL = '';
  CO_IMAGE_FOLDER = '';
  CO_REPORTS_FOLDER = '';
  CO_GS_LOCATION = '';
  CO_BACKEND_DATE_FMT = '';
  CO_FRONTEND_DATE_FMT = '';
  CO_IMAGE_TABLE = '';
  CO_GOOGLE_BS = '';

  constructor(
    private modalService: NgbModal,
    private mainService: ParamService,
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
    if (!this.InitCompleted) {
      this.InitComponent();
    }
  }


  InitComponent() {
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    this.currentTab = 'COMPANY';
    this.initLov();
    this.List(this.currentTab);
    this.LoadCombo();
  }

  initLov(caption: string = '') {


  }

  LovSelected(_Record: SearchTable) {
  }



  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  CompanySettings() {
    this.List('COMPANY');
  }
  BranchSettings() {
  }

  DataTransfer() {
  }

  UpdateData() {
    this.currentTab = 'UPDATEDATA';
  }
  PayrollSettings() {
    this.currentTab = 'PAYROLL';

  }
  LoadCombo() {
  }

  // Query List Data
  List(_type: string) {

    this.currentTab = _type;

    this.loading = true;
    let SearchData = {
      parentid: this.gs.globalVariables.comp_code,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code
    };
    if (_type == "COMPANY")
      SearchData.parentid = this.gs.globalVariables.comp_code;

    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;

    this.ErrorMessage = '';
    this.mainService.getSettings(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        this.LockRecord = response.lockrecord;
        if (this.currentTab == 'COMPANY')
          this.ShowCompany();
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  ShowCompany() {
    this.RecordList.forEach(rec => {

      if (rec.caption == "SERVER-URL")
        this.CO_SERVER_URL = rec.name;
      if (rec.caption == "IMAGE-FOLDER")
        this.CO_IMAGE_FOLDER = rec.name;
      
      if (rec.caption == "REPORTS-FOLDER")
        this.CO_REPORTS_FOLDER = rec.name;

      if (rec.caption == "GS-LOCATION")
        this.CO_GS_LOCATION = rec.name;

      if (rec.caption == "BACKEND-DATE-FORMAT")
        this.CO_BACKEND_DATE_FMT = rec.name;
      if (rec.caption == "FRONTEND-DATE-FORMAT")
        this.CO_FRONTEND_DATE_FMT = rec.name;
      
      if (rec.caption == "IMAGE-TABLE")
        this.CO_IMAGE_TABLE = rec.name;

      if (rec.caption == "GOOGLE-BS")
          this.CO_GOOGLE_BS = rec.name;

    })
  }



  addRec(parentid: string, tablename: string, caption: string, id: string, code: string, name: string): Settings {
    var rec = new Settings;
    rec.parentid = parentid;
    rec.tablename = tablename;
    rec.caption = caption;
    rec.id = id;
    rec.code = code;
    rec.name = name;
    return rec;
  }


  // Save Company Data
  SaveCompany() {
    if (!this.allvalidCompany())
      return;
    this.loading = true;
    this.ErrorMessage = '';

    this.CreateCompanyData();

    this.Record.RecordDet = this.SaveList;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.SaveSettings(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = "Save Complete";
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }



  //Company

  CreateCompanyData() {
    this.Record = new Settings_VM;
    this.SaveList = Array<Settings>();

    let _parentid = '';
    _parentid = this.gs.globalVariables.comp_code;

    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'SERVER-URL', '', '', this.CO_SERVER_URL));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'IMAGE-FOLDER', '', '', this.CO_IMAGE_FOLDER));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'REPORTS-FOLDER', '', '', this.CO_REPORTS_FOLDER));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'GS-LOCATION', '', '', this.CO_GS_LOCATION));

    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'BACKEND-DATE-FORMAT', '', '', this.CO_BACKEND_DATE_FMT));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'FRONTEND-DATE-FORMAT', '', '', this.CO_FRONTEND_DATE_FMT));

    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'IMAGE-TABLE', '', '', this.CO_IMAGE_TABLE));

    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'GOOGLE-BS', '', '', this.CO_GOOGLE_BS));



  }
  allvalidCompany() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    return bret;
  }



  // Branch

  OnBlur(field: string) {
  }

  Close() {
    this.gs.ClosePage('home');
  }


}
