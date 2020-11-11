import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

import { Pim_Docm } from '../models/pim';
import { tablesd } from '../models/tablesm';


@Injectable({ providedIn: 'root' })
export class PimService {
   
  showInactive: boolean = false;
  parentid : "";

  ErrorMessage = "";
  InfoMessage = "";

  table_name = '';

  searchString = "";
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  tablesm_colnames = {};

  cap_id = 'ID';
  cap_store = '';
  cap_group = '';
  cap_sku = '';
  cap_file = '';
  cap_store_duplication = false;
  

  RecordList = [];
  RecordItemList = [];
  Record : Pim_Docm = new Pim_Docm;

  ColumnList : [];
  DefaultColumnList : [];
  EdiErrorList: [] = [];
  

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
    this.init();
  }


  
  init() {
    
    this.searchString = "";
    this.showInactive = false;
    this.parentid = "";

    this.ErrorMessage = "";
    this.InfoMessage = "";
   
    this.page_count = 0;
    this.page_current = 0;
    this.page_rows = 30;
    this.page_rowcount = 0;

    this.RecordItemList = []
    this.EdiErrorList = [];
    
    //this.ColumnList = [];
    //this.DefaultColumnList = [];
      
  }


  List(_type: string) {

    let SearchData = {
      type: _type,
      searchstring: this.searchString.toUpperCase(),
      grp_table_name : this.table_name,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      user_code: this.gs.globalVariables.user_code,
      user_id : this.gs.globalVariables.user_pkid,
      user_admin : this.gs.globalVariables.user_admin,
      cap_store : this.cap_store

    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.getList(SearchData)
      .subscribe(response => {
        this.RecordItemList = response.list;
        this.page_count = response.page_count;
        this.page_current = response.page_current;
        this.page_rowcount = response.page_rowcount;
      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
        });
  }
  


  loadDefault() {

    let SearchData = {
      table_name : this.table_name,
      comp_code :  this.gs.globalVariables.comp_code
    }
    this.LoadDefault(SearchData).subscribe(
      response => {
        
        this.DefaultColumnList = response.list;
        this.ColumnList = this.DefaultColumnList;
        this.cap_id = response.tablesm.tab_id;
        this.cap_store = response.tablesm.tab_store;
        this.cap_group = response.tablesm.tab_group;
        this.cap_sku = response.tablesm.tab_sku;
        this.cap_file = response.tablesm.tab_file;
        this.cap_store_duplication = response.tablesm.tab_store_duplication;

      },
      error => {
        this.ErrorMessage = this.gs.getError(error);
        alert(this.ErrorMessage);
      }
    )
  }




  // Back End Calls
  getList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Doc/List', SearchData, this.gs.headerparam2('authorized'));
  }
  
  getDocRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Doc/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Doc/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  saveDoc(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Doc/Save', SearchData, this.gs.headerparam2('authorized-fileupload'));
  }

  Download(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Doc/Download', SearchData, this.gs.headerparam2('authorized'));
  }
  
  Delete(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Doc/Delete', SearchData, this.gs.headerparam2('authorized'));
  }

}

