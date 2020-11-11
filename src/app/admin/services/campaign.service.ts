import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Campaign } from '../models/campaign';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class CampaignService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Campaign/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Campaign/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Campaign) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Campaign/Save', Record, this.gs.headerparam2('authorized'));
    }

    RunCampaign(Record: Campaign) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Campaign/RunCampaign', Record, this.gs.headerparam2('authorized'));
    }

    ResetCampaign(Record: Campaign) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Campaign/ResetCampaign', Record, this.gs.headerparam2('authorized'));
    }


    Delete(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Pim/Campaign/Delete', SearchData, this.gs.headerparam2('authorized'));
    }


}

