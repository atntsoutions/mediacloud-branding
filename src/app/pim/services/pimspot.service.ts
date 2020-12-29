import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

import { pim_spot, pim_spot_model } from '../models/pim_spot';


@Injectable({ providedIn: 'root' })
export class PimSpotService {
   
  db = {};

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  resetData(){
    this.db  = {};
  }

  init(urlid : string ) {
    let rec : pim_spot_model;
    if ( this.db[urlid] == null ) {
      rec =  new pim_spot_model();
      rec.data_status = -1;
      rec.tab = "LIST";
      rec.pkid = "";
      rec.mode = "ADD";
      rec.searchString = "";
      rec.ErrorMessage = "";
      rec.InfoMessage = "";
      rec.page_count = 0;
      rec.page_current = 0;
      rec.page_rows = 30;
      rec.page_rowcount = 0;
      rec.Record = new  pim_spot();
      rec.RecordDet =  [];
      rec.RecordList = [];
      this.db[urlid] = rec;
    }
    
    return this.db[urlid];
    
  }

  

  /* Group */
  // Back End Calls
  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Spot/List', SearchData, this.gs.headerparam2('authorized'));
  }

  public getRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Spot/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  public Save(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Spot/Save', SearchData,  this.gs.headerparam2('authorized-fileupload'));
  }

  public SaveDet(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Spot/SaveDet', SearchData,  this.gs.headerparam2('authorized-fileupload'));
  }

  public UpdateDet(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Spot/UpdateDet', SearchData,  this.gs.headerparam2('authorized-fileupload'));
  }



  public getSpotMemo(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Spot/SpotMemo', SearchData, this.gs.headerparam2('authorized'));
  }


  public delete(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Spot/Delete', SearchData, this.gs.headerparam2('authorized'));
  }

  public deleteDet(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Spot/DeleteDet', SearchData, this.gs.headerparam2('authorized'));
  }

}

