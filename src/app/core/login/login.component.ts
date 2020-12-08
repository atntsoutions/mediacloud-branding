
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Companym } from '../models/company';
import { GlobalService } from '../services/global.service';
import { LoginService } from '../services/login.service';

import { AppState } from 'src/app/reducers';
import { Store } from '@ngrx/store';

import { PimService } from 'src/app/pim/services/pim.service';
import { PimSpotService } from 'src/app/pim/services/pimspot.service';
import { PimJobService } from 'src/app/pim/services/pimjob.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  // login screen 2
  errorMessage: string;
  ErrorExternalLogin: string = '';
  errorMessageVersion: string = '1.124';
  software_version_string: string = '1.124';

  username: string = 'admin';
  password: string = 'admin';

  server_software_version_string: string = '';
  showloginbutton: boolean = true;

  company_code: string = '';

  bshowCompany = false;

  loading = false;
  showlogin = false;

  CompanyList: Companym[] = [];

  public gs: GlobalService;

  constructor(
    private router: Router,
    private gs1: GlobalService,
    private store: Store<AppState>,
    private loginservice: LoginService,
    private pimsrv: PimService,
    private spotService : PimSpotService,
    private jobService : PimJobService,

  ) {

    

    this.gs = gs1;
    this.gs.loadBaseUrl();
    this.LoadCombo();
    this.InitAllService();
  }

  InitAllService() {
    this.pimsrv.init();
    this.spotService.resetData();
    this.jobService.resetData();
  }



  LoadCombo() {
    this.loading = true;
    let SearchData = {
      userid: ''
    };



    this.loginservice.LoadCompany(SearchData)
      .subscribe(response => {
        this.CompanyList = response.list;
        this.server_software_version_string = response.version;

        if (this.software_version_string != this.server_software_version_string) {
          this.errorMessage = "New Version Available, Kindly Clear Browser History";

          this.showloginbutton = false;
        }

        this.CompanyList.forEach(rec => {
          if (this.company_code == '')
            this.company_code = rec.comp_code;
        });

        if ( this.CompanyList.length > 1 )
          this.bshowCompany = true;

        this.loading = false;
        this.showlogin = true;
      },
        error => {
          this.loading = false;
          this.showlogin = false;
          this.errorMessage = error.error.error_description;
          if ( this.errorMessage == undefined)
            this.errorMessage = error.message;
        });
  }

  Login() {

    if (!this.username) {
      this.errorMessage = 'Login ID Cannot Be Blank';
      return;
    }
    if (!this.password) {
      this.errorMessage = 'Password Cannot Be Blank';
      return;
    }
    if (!this.company_code) {
      this.errorMessage = 'Please Select Company';
      return;
    }

    if (this.software_version_string != this.server_software_version_string) {
      this.errorMessage = "New Version Available, Kindly Clear Browser History";
      this.showloginbutton = false;
      return;
    }


    this.username = this.username.toUpperCase();
    this.password = this.password.toUpperCase();

    this.loading = true;

    this.loginservice.Login(this.username, this.password, this.company_code)
      .subscribe(response => {
        this.loading = false;
        let user = response;

        if (user && user.access_token) {
          this.gs.IsLoginSuccess = true;
          this.gs.Access_Token = user.access_token;
          this.gs.globalVariables.user_pkid = user.userpkid;
          this.gs.globalVariables.user_code = user.usercode;
          this.gs.globalVariables.user_name = user.userName;
          this.gs.globalVariables.user_email = user.useremail;
          this.gs.globalVariables.user_company_id = user.usercompanyid;
          this.gs.globalVariables.user_company_code = user.usercompanycode;
          this.gs.globalVariables.user_branch_id = user.userbranchid;
          this.gs.globalVariables.sman_id = user.usersmanid;
          this.gs.globalVariables.sman_name = user.usersmanname;
          this.gs.baseLocalServerUrl = user.userlocalserver;
          this.gs.globalVariables.ipaddress = user.useripaddress;
          this.gs.globalVariables.tokenid = user.usertokenid;
          this.gs.globalVariables.user_branch_user = user.user_branch_user;
          this.gs.globalVariables.branch_code = '';
          this.gs.globalVariables.year_code = '';
          this.gs.globalVariables.user_admin = false;

          this.gs.globalVariables.user_vendor_id = user.user_vendor_id;
          this.gs.globalVariables.user_region_id  = user.user_region_id;
          this.gs.globalVariables.user_role_id   = user.user_role_id;
          this.gs.globalVariables.user_role_name = user.user_role_name ;
          this.gs.globalVariables.user_role_rights_id = user.user_role_rights_id;


          if ( user.usercode == 'ADMIN')
            this.gs.globalVariables.user_admin = true;
        }

        if (this.gs.IsLoginSuccess) {
          this.errorMessage = "Login Success";
          this.LoadMenu();
        }
        else {
          this.errorMessage = "Login Failed";
        }
      },
        error => {
          this.loading = false;
          this.errorMessage = error.error.error_description;
        });
  }

  LoadMenu() {
    let SearchData = {
      userid: this.gs.globalVariables.user_pkid,
      usercode: this.gs.globalVariables.user_code,
      compid: this.gs.globalVariables.user_company_id,
      compcode: this.gs.globalVariables.user_company_code,
      branchid: '',
      yearid: '',
      ipaddress: this.gs.globalVariables.ipaddress,
      tokenid: this.gs.globalVariables.tokenid
    };

    this.loading = true;
    this.loginservice.LoadMenu(SearchData)
      .subscribe(response => {
        this.gs.IsAuthenticated = true;
        this.loading = false;
        
        this.gs.MenuList = response.list;
        this.gs.Modules = response.modules;
        let data = response.data;

        this.gs.globalVariables.comp_pkid = data.comp_pkid;
        this.gs.globalVariables.comp_code = data.comp_code;
        this.gs.globalVariables.comp_name = data.comp_name;
        this.gs.Company_Name = data.comp_name;
        this.gs.globalVariables.report_folder = data.report_folder;

        this.gs.globalVariables.server_image_url = data.server_image_url;
        this.gs.globalVariables.server_image_path = data.server_image_path;
        this.gs.globalVariables.server_report_path = data.server_report_path;


        this.gs.InitdefaultValues();

        localStorage.setItem('access_token', this.gs.Access_Token);
        localStorage.setItem('company_name', this.gs.Company_Name);
        localStorage.setItem('menu', JSON.stringify(this.gs.MenuList));
        localStorage.setItem('modules', JSON.stringify(this.gs.Modules));
        localStorage.setItem('gv', JSON.stringify(this.gs.globalVariables));
        localStorage.setItem('dv', JSON.stringify(this.gs.defaultValues));

        this.router.navigate(['home'], { replaceUrl: true });
        
      },
        error => {
          this.loading = false;
          alert(this.gs.getError(error));
        });
  }

  Logout() {
    this.loginservice.Logout();
    this.errorMessage = 'Pls Login';
  }

  NewLogout() {
    this.loginservice.Logout();
    this.errorMessage = 'Pls Login';
  }


}
