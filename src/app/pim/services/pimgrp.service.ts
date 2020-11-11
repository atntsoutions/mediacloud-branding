import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

import { TreeComponent, TreeNode  } from 'angular-tree-component';
import { Pim_Docm } from '../models/pim';
import { tablesd } from '../models/tablesm';


@Injectable({ providedIn: 'root' })
export class PimGrpService {
   
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
  

  RecordTables = [];

  RecordList = [];

  nodes = [
  ];
  options = {
    allowDrag:false,
    allowDrop:true,
    actionMapping: {
      mouse: {
        drop: (tree, node, $event, {from, to}) => {
          console.log('drag', from, to); // from === {name: 'first'}
          // Add a node to `to.parent` at `to.index` based on the data in `from`
          // Then call tree.update()
        }
      }
    }    
  };

 

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

    this.initNodes();
    
    
  }

  initNodes(){
    this.nodes = [];
  }


  List(_type: string) {

    let SearchData = {
      type: _type,
      searchstring: this.searchString.toUpperCase(),
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      user_code: this.gs.globalVariables.user_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.getGrpupList(SearchData)
      .subscribe(response => {
        
        this.RecordTables = response.list;

        this.page_count = response.page_count;
        this.page_current = response.page_current;
        this.page_rowcount = response.page_rowcount;
      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
        });
  }



  /* Group */
  // Back End Calls
  getGrpupList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Group/List', SearchData, this.gs.headerparam2('authorized'));
  }

  public getGroupRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Group/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  public saveGroup(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Group/Save', SearchData, this.gs.headerparam2('authorized'));
  }

  public deleteGroup(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Group/Delete', SearchData, this.gs.headerparam2('authorized'));
  }

}

