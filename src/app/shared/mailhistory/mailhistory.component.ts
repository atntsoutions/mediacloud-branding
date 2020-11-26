import { Component, Input, Output, OnInit, OnDestroy, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../models/searchtable';

import { mailhistory } from '../models/mailhistory';

@Component({
  selector: 'App-mailhistory',
  templateUrl: './mailhistory.component.html'
})
export class MailHistoryComponent {
  
  title = 'Mail History';

  isOk = false;
  loading=false;

  private _caption: string = '';
  @Input() set caption(value: string) {
    if (value != null)
      this._caption = value;
  }
  get caption() : string{
    return this._caption;
  }

  private _sendCaption: string = '';
  @Input() set sendCaption(value: string) {
    if (value != null)
      this._sendCaption = value;
  }
  get sendCaption() : string {
    return this._sendCaption;
  }
  
  private pkid: string = '';
  @Input() set id(value: string) {
    if (value != null)
      this.pkid = value;
  }



  private _maildata: mailhistory ;
  @Input() set maildata(value: mailhistory) {
    if (value != null)
    {
      this._maildata = value;
      if (this._maildata.mail_process_id > 0) {
        if ( this.isOk) {
          this.Save();
        }
      }
    }
  }


  @Output() getMailData = new EventEmitter<string>();

   bSave = true;

  
  InitCompleted: boolean = false;

  ErrorMessage = "";
  InfoMessage = "";
  RecordList: mailhistory[] = [];

  Record : mailhistory ;

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

    this.gs.ListMailHistory(SearchData)
      .subscribe(response => {
        this.InfoMessage = '';
        this.RecordList = response.list;
        
      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
      });
  }


  getDataFromParent() { 
    this.isOk =true;
    this.loading = true;
    this.getMailData.emit('MAIL');
  }

  Save() {
      this.bSave =false;
      this.ErrorMessage = '';
      this.Record =  this._maildata;
      this.Record._globalvariables = this.gs.globalVariables;
      this.gs.SaveMailHistory (this.Record)
        .subscribe(response => {
          this.loading = false;
            this.getMailData.emit('SEND');
            alert('Email Sent');
            this.modalService.dismissAll(null);
        },
        error => {
          this.loading = false;          
          this.bSave = true;
          this.getMailData.emit('SEND');          
          this.ErrorMessage = this.gs.getError(error);
      });
  }


}
