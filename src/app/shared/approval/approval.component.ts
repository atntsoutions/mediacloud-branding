import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../models/searchtable';

import { approvald } from '../models/approvald';

@Component({
  selector: 'App-Approval',
  templateUrl: './approval.component.html'
})
export class ApprovalComponent {
  
  title = 'Approval';
  
  loading = false;

  private pkid: string = '';
  @Input() set id(value: string) {
    if (value != null)
      this.pkid = value;
  }

  private _source: string = '';
  @Input() set source(value: string) {
    if (value != null)
      this._source = value;
  }

  private _refno: string = '';
  @Input() set refno(value: string) {
    if (value != null)
      this._refno = value;
  }

  @Input() set caption(value: string) {
    if (value != null)
      this.title = value;
  }


  comments = '';

  bSave = true;

  
  InitCompleted: boolean = false;

  ErrorMessage = "";
  InfoMessage = "";
  RecordList: approvald[] = [];

  Record : approvald ;

  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService,
    private modalService: NgbModal
  ) { 
    
  }
    
  ngOnInit() {

  }

  showContent(content) {
    this.bSave = true;
    this.comments = '';
    this.List();
    this.modalService.open(content, { centered: true });
  }


  List() {

    this.InfoMessage = '';
    this.ErrorMessage = '';

    if (this.pkid.trim().length <= 0) {
      this.ErrorMessage = "Invalid ID";
      return;
    }

    this.loading = true;

    let SearchData = {
      pkid: this.pkid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code : this.gs.globalVariables.user_code,
    };

    this.gs.ListApproval(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = '';
        this.RecordList = response.list;
        
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
      });
  }


    Save(status : string ) {


      if (this.comments.length <= 0) {
        alert('comments need to be enterd');
        return ;
      }
        
        this.ErrorMessage = '';

        this.Record = new approvald;

        this.Record.ad_parent_id = this.pkid;
        this.Record.ad_by = this.gs.globalVariables.user_code;
        this.Record.ad_remarks = this.comments;
        this.Record.ad_status = status;
        this.Record.ad_refno = this._refno;
        this.Record.ad_source = this._source;

        if (status =="APPROVE")
          this.Record.ad_status  ="APPROVED";
        if (status =="REJECT")
          this.Record.ad_status  ="REJECTED";


        this.Record._globalvariables = this.gs.globalVariables;

        this.loading = true;
        this.bSave =false;
        
        this.gs.SaveApproval (this.Record)
            .subscribe(response => {
              this.loading = true;
              
                this.List();
            },
            error => {
              this.loading = true;
              this.bSave = true;
              this.ErrorMessage = this.gs.getError(error);
            });
    }


}
