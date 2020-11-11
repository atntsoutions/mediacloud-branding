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
  
  private pkid: string = '';
  @Input() set id(value: string) {
    if (value != null)
      this.pkid = value;
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


    let SearchData = {
      pkid: this.pkid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code : this.gs.globalVariables.user_code,
    };

    this.gs.ListApproval(SearchData)
      .subscribe(response => {
        this.InfoMessage = '';
        this.RecordList = response.list;
        
      },
        error => {
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

        if (status =="APPROVE")
          this.Record.ad_status  ="APPROVED";


        this.Record._globalvariables = this.gs.globalVariables;

        this.gs.SaveApproval (this.Record)
            .subscribe(response => {
                this.bSave =false;
                this.List();
            },
            error => {
              this.ErrorMessage = this.gs.getError(error);
            });
    }


}
