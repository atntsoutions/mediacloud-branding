import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';

import { SearchTable } from '../../shared/models/searchtable';

import { PimSpotService } from '../services/pimspot.service';
import { pim_spot, pim_spotd, pim_spot_model } from '../models/pim_spot';


@Component({
  selector: 'app-pimjobdet',
  templateUrl: './pimjobdet.component.html'
})
export class PimJobDetComponent {
  // Local Variables 

  title = 'Spot Registration';

  tab = 'LIST';

  imageFileName ="";

  @Input() menuid: string = '';
  @Input() Record: pim_spotd ;
  @Input() menu_record: any;

  @Input() bApproval: boolean;

  @Output() saveStatus = new EventEmitter<pim_spotd>();
  @Output() deleteDet = new EventEmitter<string>();


  

  canSave = true;
  mode = "new";

  
  sub: any;

  isAdmin = false;

  

  constructor(
    private modalService: NgbModal,
    public ms: PimSpotService,
    private route: ActivatedRoute,
    public gs: GlobalService
  ) {
    
    this.InitComponent();

    if (this.gs.globalVariables.user_role_name == "ZONE ADMIN" || this.gs.globalVariables.user_admin)
    {
      this.isAdmin = true;
    }

  }

  ngOnInit() {
  }

  InitComponent() {
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
  }


  showImage(content, vname : string) {
    
    this.imageFileName = '';

    if ( vname == 'closeview')
      this.imageFileName =  this.gs.getServerImageFolder(this.Record.spotd_pkid, 'closeview', this.Record.spotd_close_view);
    
      if ( vname == 'longview')
      this.imageFileName =  this.gs.getServerImageFolder(this.Record.spotd_pkid, 'longview', this.Record.spotd_long_view);

    if ( vname == 'finalview')
      this.imageFileName =  this.gs.getServerImageFolder(this.Record.spotd_pkid, 'finalview', this.Record.spotd_final_view);

    this.modalService.open(content, { centered: true });


  }



  ActionHandler(action: string, id: string) {
  }


  checkRights() {
    this.canSave = false;
    if (this.menu_record)
    {
      if (this.menu_record.rights_admin)
        this.canSave = true;
      if (this.Record.rec_mode == "ADD" && this.menu_record.rights_add)
        this.canSave = true;
      if (this.Record.rec_mode == "EDIT" && this.menu_record.rights_edit)
        this.canSave = true;
    }
    return this.canSave;      
  }

  SaveStatus(status : string ){

    if (confirm('Are you sure you want to update status')) {
      if ( this.saveStatus) {
        this.Record.spotd_status = status;
        this.saveStatus.emit(this.Record);
      }
    }
  }

  Delete(){
      if ( this.Record.rec_mode == "EDIT") {
        if ( this.deleteDet) {
          this.deleteDet.emit(this.Record.spotd_pkid);
        }
      }
      else{
          alert('cannot delete');
        }
  }

  SaveDet() {
    let frmData: FormData = new FormData();
    this.Record._globalvariables = this.gs.globalVariables;
    frmData.append("record", JSON.stringify(this.Record));
    this.ms.UpdateDet(frmData).subscribe(
      response => {
        alert('Updation Completed');
      },
      error => {
        alert( this.gs.getError(error));
      }
    )
  }


}

