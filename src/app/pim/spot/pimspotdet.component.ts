import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';

import { SearchTable } from '../../shared/models/searchtable';

import { PimSpotService } from '../services/pimspot.service';
import { pim_spot, pim_spotd, pim_spot_model } from '../models/pim_spot';


@Component({
  selector: 'app-pimspotdet',
  templateUrl: './pimspotdet.component.html'
})
export class PimSpotDetComponent {
  // Local Variables 

  title = 'Spot Registration';

  tab = 'LIST';

  imageFileName ="";

  @Input() menuid: string = '';
  @Input() Record: pim_spotd ;
  @Input() menu_record: any;

  @Output() saveDet = new EventEmitter<pim_spotd>();
  @Output() deleteDet = new EventEmitter<string>();


  canSave = true;
  mode = "new";

  bResize = false;
  
  sub: any;

  isAdmin = false;

  constructor(
    private modalService: NgbModal,
    public ms: PimSpotService,
    private route: ActivatedRoute,
    public gs: GlobalService
  ) {
    
    this.InitComponent();

  }

  ngOnInit() {
  }

  InitComponent() {
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
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

  Save(){
    if ( this.saveDet)
      this.saveDet.emit(this.Record);
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


}

