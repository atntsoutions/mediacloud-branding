import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tablesm } from '../models/tablesm';

import { GlobalService } from '../../core/services/global.service';
import { tablesd } from 'src/app/pim/models/tablesm';

@Injectable({ providedIn: 'root' })
export class TablesService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Tablesm/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Tablesm/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: tablesm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Tablesm/Save', Record, this.gs.headerparam2('authorized'));
    }

    SaveDetail(Record: tablesd ) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Tablesm/SaveDetail', Record, this.gs.headerparam2('authorized'));
    }


    DeleteDetail(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Tablesm/DeleteDetail', SearchData, this.gs.headerparam2('authorized'));
    }


    DeleteTable(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Tablesm/DeleteTable', SearchData, this.gs.headerparam2('authorized'));
    }

}

