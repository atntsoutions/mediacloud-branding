import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { PimService } from '../services/pim.service';
import { SearchTable } from '../../shared/models/searchtable';
import { TreeNode } from 'angular-tree-component';
import { Pim_Docm } from '../models/pim';
import { tablesd } from '../models/tablesm';


@Component({
  selector: 'app-pimdoc',
  templateUrl: './pimdoc.component.html'
})
export class PimDocComponent {
  // Local Variables 
  title = '';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() parentid: string = '';
  @Input() showHeading: boolean = true;
  @Input() table_name = '';


  isAll = false;


  selectedRowIndex: number = -1;
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;

  canSave = false;

  category: "";

  bAdmin = false;
  bChanged: boolean;
  user_admin = false;

  tab = 'LIST';

  imageFileName = '';
  myFiles = [];
  myFiles2 = [];

  constructor(
    private modalService: NgbModal,
    public ms: PimService,
    private route: ActivatedRoute,
    public gs: GlobalService
  ) {

    this.menuid = this.gs.getParameter("menuid");
    this.table_name = this.gs.getParameter("type");
    this.ms.table_name = this.table_name;

    this.InitComponent();
    this.ms.loadDefault();
    this.ms.List('NEW')

  }

  ngOnInit() {
  }

  InitComponent() {
    this.bAdmin = false;
    this.user_admin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
    }
  }


  // Destroy Will be called when this component is closed
  ngOnDestroy() {
  }

  LovSelected(_Record: SearchTable) {

  }

  ActionHandler(action: string, id: string) {

    if (action == 'LIST') {
      this.tab = 'LIST';
      this.ms.ErrorMessage = "";
      this.ms.InfoMessage = "";
    }
    if (action == 'NEW') {

      this.tab = 'DETAILS';
      this.ms.Record = new Pim_Docm;
      this.ms.Record.doc_pkid = this.gs.getGuid();
      this.ms.Record.doc_store_id = '';
      this.ms.Record.doc_store_name = '';

      this.ms.Record.doc_grp_id = '';
      this.ms.Record.doc_grp_level_name = '';

      this.ms.Record.doc_table_name = this.table_name;
      this.ms.Record.doc_name = "";
      this.ms.Record.doc_file = null;
      this.ms.Record.doc_file_name = "";
      this.ms.Record.doc_thumbnail = "";
      this.ms.Record.doc_server_folder = "";
      this.ms.Record.rec_mode = "ADD";

      this.ms.ColumnList = this.ms.DefaultColumnList;

      this.myFiles = [];
      this.myFiles2 = [];

      //this.ms.loadDefault();

      this.resetRights();
      this.ms.ErrorMessage = "";
      this.ms.InfoMessage = "";

    }
    if (action == 'EDIT') {
      this.tab = 'DETAILS';
      this.myFiles = [];
      this.myFiles2 = [];

      //this.ms.ColumnList = [];

      this.loadData(id);

      this.resetRights();

      this.ms.ErrorMessage = "";
      this.ms.InfoMessage = "";

    }
  }


  resetRights() {
    this.canSave = false;
    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.canSave = true;
    if (this.ms.Record.rec_mode == "ADD" && this.menu_record.rights_add)
      this.canSave = true;
    if (this.ms.Record.rec_mode == "EDIT" && this.menu_record.rights_edit)
      this.canSave = true;
  }


  loadData(id: string) {
    let SearchData = {
      pkid: id,
      table_name: this.ms.table_name,
      comp_code: this.gs.globalVariables.comp_code
    }
    this.ms.getDocRecord(SearchData).subscribe(
      response => {
        this.ms.Record = response.record;
        this.ms.ColumnList = response.list;
        this.ms.Record.rec_mode = "EDIT";
      },
      error => {
        this.ms.ErrorMessage = this.gs.getError(error);
        alert(this.ms.ErrorMessage);
      }
    )
  }

  Close() {
    this.gs.ClosePage('home');
  }

  SelectCheckbox() {

  }


  getFileDetails(e: any) {

    let isValidFile = true;
    let fname: string = '';

    this.myFiles = [];
    this.ms.Record.doc_file_name = '';
    for (var i = 0; i < e.target.files.length; i++) {
      fname = e.target.files[i].name;
      this.ms.Record.doc_file_name = fname;
      if (fname.indexOf('&') >= 0)
        isValidFile = false;
      if (fname.indexOf('%') >= 0)
        isValidFile = false;
      if (fname.indexOf('#') >= 0)
        isValidFile = false;
      this.myFiles.push(e.target.files[i]);
    }

    if (!isValidFile) {

      alert('Invalid File Name - &%#');
    }
  }


  getFileDetails2(e: any, rec: tablesd) {
    let isValidFile = true;
    let fname: string = '';
    rec.tabd_col_file = null;

    for (var i = 0; i < e.target.files.length; i++) {
      fname = e.target.files[i].name;
      rec.tabd_col_value = fname;
      if (fname.indexOf('&') >= 0)
        isValidFile = false;
      if (fname.indexOf('%') >= 0)
        isValidFile = false;
      if (fname.indexOf('#') >= 0)
        isValidFile = false;

      rec.tabd_col_file = e.target.files[i];

    }

    if (!isValidFile) {

      alert('Invalid File Name - &%#');
    }
  }




  saveDoc() {

    let uploaderror = "";

    this.ms.InfoMessage = "";
    this.ms.ErrorMessage = "";

    if (this.ms.cap_store) {
      if (this.ms.Record.doc_store_id.toString().trim().length <= 0) {
        alert(this.ms.cap_store + ' Cannot Be Empty');
        return;
      }
    }
    if (this.ms.cap_group) {
      if (this.ms.Record.doc_grp_id.toString().trim().length <= 0) {
        alert(this.ms.cap_group + ' Cannot Be Empty');
        return;
      }
    }

    if (this.ms.cap_sku) {
      if (this.ms.Record.doc_name.toString().trim().length <= 0) {
        alert(this.ms.cap_sku + ' Cannot Be Empty');
        return;
      }
    }

    this.ms.ColumnList.forEach((itm: tablesd) => {
      if (itm.tabd_col_mandatory == 'Y') {
        if (itm.tabd_col_value == null || itm.tabd_col_value == undefined || itm.tabd_col_value == '') {
          if (uploaderror != '')
            uploaderror += "\n";
          uploaderror += itm.tabd_col_caption + ' Cannot Be Empty';
        }
      }
      if (itm.tabd_col_type == 'NUMBER') {

        if (itm.tabd_col_value.toString().length > itm.tabd_col_len) {
          if (uploaderror != '')
            uploaderror += "\n";
          uploaderror += itm.tabd_col_caption + ' Allowed Length is ' + itm.tabd_col_len.toString();
        }

      }
    })

    if (uploaderror != '') {
      alert(uploaderror);
      return;
    }


    let frmData: FormData = new FormData();

    this.ms.Record._globalvariables = this.gs.globalVariables;

    frmData.append("record", JSON.stringify(this.ms.Record));
    frmData.append("records", JSON.stringify(this.ms.ColumnList));

    /*
    for (var i = 0; i < this.myFiles.length; i++) {
      frmData.append("fileUpload", this.myFiles[i]);
    }
    */

    if (this.ms.Record.doc_file != null && this.ms.Record.doc_file_name != "")
      frmData.append("fileUpload", this.ms.Record.doc_file);

    this.ms.ColumnList.forEach((element: tablesd) => {
      if (element.tabd_col_type == "FILE") {
        if (element.tabd_col_file != null && element.tabd_col_value != "") {
          frmData.append("fileUpload", element.tabd_col_file);
        }
      }
    });

    this.ms.saveDoc(frmData).subscribe(
      response => {

        if (response.uploaderror != "")
          uploaderror = " Error : " + response.uploaderror;

        if (this.ms.Record.rec_mode == "ADD") {
          this.ms.Record.rec_mode = "EDIT";
          this.ms.Record.doc_slno = response.slno;
          this.ms.RecordItemList.push(this.ms.Record);
        }

        const item = this.ms.RecordItemList.find(rec => rec.doc_pkid == this.ms.Record.doc_pkid);
        if (item != null) {

          item.doc_name = this.ms.Record.doc_name;
          item.doc_store_name = this.ms.Record.doc_store_name;
          item.doc_grp_level_name = this.ms.Record.doc_grp_level_name;
          item.doc_file_name = this.ms.Record.doc_file_name;
          item.doc_thumbnail = "";
          item.doc_thumbnail = response.thumbnail;

          this.ms.Record.doc_server_folder = "";
          this.ms.Record.doc_thumbnail = "";
          this.ms.Record.doc_server_folder = response.server;
          this.ms.Record.doc_thumbnail = response.thumbnail;

          if (uploaderror != "") {
            item.doc_file_name = "";
            item.doc_thumbnail = "";
            alert(uploaderror);
          }

        }

      },
      error => {
        this.ms.ErrorMessage = this.gs.getError(error);
        alert(this.ms.ErrorMessage);
      }
    );

  }

  getThumbnail() {

    return this.ms.Record.doc_server_folder + "\"" + this.ms.Record.doc_thumbnail;

  }

  showFile() {
    window.open(this.imageFileName, "_blank",);
  }

  remove(rec: Pim_Docm) {
    if (confirm("Are you sure to delete " + rec.doc_name)) {

      let SearchData = {
        pkid: rec.doc_pkid,
        comp_code: this.gs.globalVariables.comp_code,
        table_name: this.ms.table_name
      };
      this.ms.ErrorMessage = '';
      this.ms.Delete(SearchData)
        .subscribe(response => {
          alert('Record Removed');
          this.ms.RecordItemList = this.ms.RecordItemList.filter(r => r.doc_pkid != rec.doc_pkid);
        },
          error => {
            this.ms.ErrorMessage = this.gs.getError(error);
          });
    }

  }



  showImage(content, slno: number, folder: string, imageName: string) {
    if (imageName == undefined)
      this.imageFileName = '';
    else
      this.imageFileName = folder + "\\" + imageName;
    this.modalService.open(content, { centered: true });

  }

  Download(_type: string) {
    let SearchData = {
      type: _type,
      grp_level_id: '',
      grp_table_name: this.ms.table_name,
      searchstring: this.ms.searchString.toUpperCase(),
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code
    };

    this.ms.Download(SearchData).subscribe(
      response => {
        if (response.status == "OK")
          this.gs.DownloadFile("", response.filename_csv, response.filetype_csv, response.filedisplayname_csv);
        //this.gs.DownloadFile("", response.filename_xml1, response.filetype_xml1, response.filedisplayname_xml1);
        //this.gs.DownloadFile("", response.filename_xml2, response.filetype_xml2, response.filedisplayname_xml2);
      },
      error => {
        alert(this.gs.getError(error));
      });

  }

  getTimeStamp(){
    return '?t=' + new Date().getTime();
  }


}


