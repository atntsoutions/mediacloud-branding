import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Router } from '@angular/router';
import { GlobalData } from '../models/globaldata';
import { GlobalVariables } from '../models/globalvariables';
import { DefaultValues } from '../models/defaultvalues';
import { Menum } from '../models/menum';
import { Modulem } from '../models/modulem';
@Injectable()
export class GlobalService {
  public Token: string;
  public Company_Name: string;
  public IsLoginSuccess: boolean = false;
  public IsAuthenticated: boolean = false;
  public Access_Token: string;
  public globalData: GlobalData;
  public globalVariables: GlobalVariables;
  public defaultValues: DefaultValues;

  public baseLocalServerUrl: string = "";

  public baseUrl: string = "http://202.88.246.57:9001";
  //public baseUrl: string = "http://localhost:9001";
  //public baseUrl: string = "http://localhost:5000";

  public isLocalSever = false;

  public dateFormat = "dd-mm-yyyy";
  //public dateFormat = "mm-dd-yyyy";
  

  // change this is false in production and update
  public isolderror: boolean = false;

  public Modules: Modulem[] = [];
  public MenuList: Menum[] = [];


  public TradingPartners: any[];

  constructor(
    private http2: HttpClient,
    private location: Location,
    private router: Router) {
    this.Company_Name = "";
    this.globalVariables = new GlobalVariables;
    this.globalData = new GlobalData;
    this.InitdefaultValues();
  }

  public getGuid(): string {
    let uuid = UUID.UUID();
    return uuid.toUpperCase();
  }

  public getPagetitle(menucode: string): string {
    return this.MenuList.find(f => f.menu_code == menucode).menu_name;
  }

  public getMenu(menucode: string): Menum {
    return this.MenuList.find(f => f.menu_code == menucode);
  }

  public getError(error: any) {
    if (this.isolderror)
      return JSON.parse(error.error).Message;
    else
      return error.error.Message;
  }

  public resetMenu(){
    this.Modules = [];
    this.MenuList = [];
  }


  public headerparam2(type: string, company_code: string = '') {
    let headers = new HttpHeaders();

    if (type == 'login')
      headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    if (type == 'authorized') {
      headers = headers.append('Authorization', 'Bearer ' + this.Access_Token);
      headers = headers.append('Content-Type', 'application/json');
    }

    if (type == 'authorized-fileupload') {
      headers = headers.append('Authorization', 'Bearer ' + this.Access_Token);
      headers = headers.delete('Content-Type');
    }

    if (type == 'anonymous') {
      headers = headers.append('Content-Type', 'application/json');

    }
    if (type == 'excel') {
      headers = headers.append('Authorization', 'Bearer ' + this.Access_Token);
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('Accept', 'application/x-msexcel');
      //options.responseType = ResponseContentType.Blob;
    }
    if (company_code != '')
      headers = headers.append('company-code', company_code);

    const options = {
      headers: headers,
    };

    return options;
  }


  public ClosePage(sPage: string, IsCloseButton = false) {
    this.location.back();
  }


  public roundNumber(_number: number, _precision: number) {
    var factor = Math.pow(10, _precision);
    var tempNumber = _number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };



  public InitdefaultValues() {

    this.defaultValues = new DefaultValues;
    this.defaultValues.today = new Date().toISOString().slice(0, 10);
    this.defaultValues.monthbegindate = this.getNewdate(0);
    this.defaultValues.lastmonthdate = this.getNewdate(30);//get today -30 days

    this.defaultValues.root_folder = '';
    this.defaultValues.sub_folder = '';

  }
  public getNewdate(_days: number) {
    var nDate = new Date();
    if (_days <= 0)
      nDate.setDate(1);
    else
      nDate.setDate(nDate.getDate() - _days);
    return nDate.toISOString().slice(0, 10);
  }


  public roundWeight(_number: number, _category: string) {

    let _precision: number;
    _precision = 0;
    if (_category == "CBM")
      _precision = 3;
    else if (_category == "NTWT")
      _precision = 3;
    else if (_category == "GRWT")
      _precision = 3;
    else if (_category == "CHWT")
      _precision = 3;
    else if (_category == "PCS")
      _precision = 3;
    else if (_category == "PKG")
      _precision = 0;
    else if (_category == "EXRATE")
      _precision = 2;
    else if (_category == "RATE")
      _precision = 2;
    else if (_category == "AMT")
      _precision = 2

    var factor = Math.pow(10, _precision);
    var tempNumber = _number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };


  Naviagete(menu_route: string, jsonstring: string) {
    let id = this.getGuid();
    this.router.navigate([menu_route], { queryParams: { id: id, parameter: jsonstring }, replaceUrl: false });

  }


  Naviagate2(menu_route: string, param: any) {
    this.router.navigate([menu_route], { queryParams: param });
  }


  loadBaseUrl() {
    if (this.isLocalSever) {

      this.baseUrl = window.location.host;
      this.baseUrl = this.baseUrl.replace("www.", "");
      if (!this.baseUrl.startsWith("http"))
        this.baseUrl = "http://" + this.baseUrl;
      console.log(this.baseUrl);
    }
  }


  getParameter(theParameter): string {
    var params = window.location.search.substr(1).split('&');
    for (var i = 0; i < params.length; i++) {
      var p = params[i].split('=');
      if (p[0] == theParameter) {
        return decodeURIComponent(p[1]);
      }
    }
    return '';
  }

  public isNull(iData: any): boolean {
    if (iData == null || iData == undefined)
      return true;
    else
      return false;
  }

  public isBlank(iData: any): boolean {
    if (iData == null || iData == undefined || iData == '')
      return true;
    else
      return false;
  }

  public isZero(iData: any): boolean {
    if (iData == null || iData == undefined || iData == 0)
      return true;
    else
      return false;
  }


  public getServerImageFolder(mainid : string , subid : string ){
    let str =  `${this.globalVariables.server_image_url}\\DOCS\\${mainid}\\${subid}\\`;
    return str;
  }


  public makecall(url: string, SearchData: any) {
    return this.http2.post<any>(this.baseUrl + url, SearchData, this.headerparam2('authorized'));
  }

  public getFile(report_folder: string, filename: string, filetype: string, filedisplayname: string = 'N') {
    let body = 'report_folder=' + report_folder + '&filename=' + filename + '&filetype=' + filetype + '&filedisplayname=' + filedisplayname;
    return this.http2.get(this.baseUrl + '/api/Admin/User/DownloadFile?' + body, { responseType: 'blob' })
  }


  public SendEmail(SearchData: any) {
    return this.http2.post<any>(this.baseUrl + "/api/Email/Common", SearchData, this.headerparam2('authorized'));
  }

  public SearchRecord(SearchData: any) {
    return this.http2.post<any>(this.baseUrl + "/api/Admin/Lov/SearchRecord", SearchData, this.headerparam2('authorized'));
  }


  public ListApproval(SearchData: any) {
    return this.http2.post<any>(this.baseUrl + "/api/Admin/Company/ListApproval", SearchData, this.headerparam2('authorized'));
  }
  public SaveApproval(Record: any) {
    return this.http2.post<any>(this.baseUrl + "/api/Admin/Company/SaveApproval", Record, this.headerparam2('authorized'));
  }


  public DownloadFile(report_folder: string, filename: string, filetype: string, filedisplayname: string = 'N') {
    let body = 'report_folder=' + report_folder + '&filename=' + filename + '&filetype=' + filetype + '&filedisplayname=' + filedisplayname;
    window.open(this.baseUrl + '/api/Admin/User/DownloadFile?' + body, "_blank");
  }



  



}
