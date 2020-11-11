import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { PimGrpService } from '../services/pimgrp.service';
import { SearchTable } from '../../shared/models/searchtable';
import { TreeComponent, TreeNode } from 'angular-tree-component';
import { Pim_Groupm } from '../models/pim';

@Component({
  selector: 'app-pimgrp',
  templateUrl: './pimgrp.component.html'
})
export class PimGrpComponent {
  // Local Variables 

  title = 'Pim Group';

  tab = 'LIST';

  @ViewChild(TreeComponent, { static: false }) private tree: TreeComponent;

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() table_name: string = '';
  @Input() parentid: string = '';
  @Input() showHeading: boolean = true;


  tab_name = '';

  canSave = false;

  pkid = '';

  selectedRowIndex: number = -1;
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;

  category: "";

  isAdmin = false;
  bChanged: boolean;

  tid = 10;

  expandedTreeNode: TreeNode = null;

  record: Pim_Groupm;

  constructor(
    private modalService: NgbModal,
    public ms: PimGrpService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {

    this.menuid = this.gs.getParameter("menuid");
    this.type = this.gs.getParameter("type");

    this.InitComponent();
    this.ms.init();
    this.ms.List('NEW');

  }

  ngOnInit() {  
  }

  InitComponent() {
    this.isAdmin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.isAdmin = true;
    }
  }


  // Destroy Will be called when this component is closed
  ngOnDestroy() {
  }


  onEvent(evt) {
    if (evt.eventName == 'toggleExpanded') {
      if (evt.isExpanded) {
        console.log('toggle Expanded', evt.node.data.id);
        this.expandedTreeNode = evt.node;
        this.getTreeData('SUB', evt.node.data.id);
      }
      else
        console.log('toggle Collapsed', evt.node.data.id);
    }
    if (evt.eventName == 'activate') {
      console.log('activate', evt.node.data.id);
      if (evt.node.isExpanded == false || evt.node.isExpanded == undefined) {
        evt.node.expand();
        this.expandedTreeNode = evt.node;
        this.getTreeData('SUB', evt.node.data.id);
      }
    }
  }


  loadTree() {
    /*
    if (this.ms.nodes.length == 0) {
      this.getTreeData('ROOT', '');
    }
    */
    this.ms.init();
    this.getTreeData('ROOT', '');
  }


  getTreeData(_type: string, _id: string) {
    let found = false;

    let SearchData = {
      type: '',
      grp_table_name: this.table_name,
      company_code: this.gs.globalVariables.comp_code,
      showinactive: this.ms.showInactive,
      parentid: _id,
    };

    this.ms.ErrorMessage = '';
    this.ms.InfoMessage = '';
    this.ms.getGroupRecord(SearchData)
      .subscribe(response => {
        this.ms.RecordList = response.list;
        this.ms.RecordList.forEach(element => {
          if (_type == 'ROOT')
            this.addNode(null, element.grp_pkid, element.grp_name, element.grp_level_id, element.grp_level_name);
          if (_type == 'SUB') {
            found = false;
            this.expandedTreeNode.data.children.forEach(child => {
              if (child.id === element.grp_pkid)
                found = true;
            });
            if (found == false)
              this.addNode(this.expandedTreeNode, element.grp_pkid, element.grp_name, element.grp_level_id, element.grp_level_name);
          }
        });

      },
        error => {
          this.ms.ErrorMessage = this.gs.getError(error);
        });
  }




  addTreeNode(_type: string) {
    if (this.category == "" || this.category == undefined) {
      alert('Text Not Entered');
      return;
    }

    var patt = /[\\/:\"*?<>|]+/;
    if (patt.test(this.category)) {
      alert('You cannot use characters \\ / : " * ? < > | ');
      return;
    }


    this.record = new Pim_Groupm;
    this.record._globalvariables = this.gs.globalVariables;
    this.record.rec_type = _type;
    this.record.grp_table_name = this.table_name;
    this.record.rec_mode = "ADD";
    this.record.grp_name = this.category;
    this.record.grp_pkid = this.gs.getGuid();
    this.record.grp_parent_id = "";

    if (_type != 'ROOT') {

      let _node = this.tree.treeModel.getActiveNode();
      if (_node == undefined || _node == null) {
        alert('Please Select a Node');
        return;
      }
      this.record.grp_parent_id = _node.id;
    }
    this.saveGroup();
  }

  saveGroup() {
    this.ms.saveGroup(this.record).subscribe(
      response => {
        let _node = this.tree.treeModel.getActiveNode();
        if (this.record.rec_type == 'ROOT')
          _node = null;

        this.addNode(_node, this.record.grp_pkid, this.record.grp_name, response.grp_level_id, response.grp_level_name);
        this.category = "";
      },
      error => {
        this.ms.ErrorMessage = this.gs.getError(error);
        alert(this.ms.ErrorMessage);
      }
    )
  }


  addNode(_node: TreeNode, _pkid: string, _grp_name: string, _grp_level_id, _grp_level_name) {
    const value = { id: _pkid, name: _grp_name, grp_level_id: _grp_level_id, grp_level_name: _grp_level_name, loaded: false, hasChildren: true, children: [] };
    if (_node) {
      _node.data.children.push(value);
      _node.expand();
    }
    else
      this.ms.nodes.push(value);
    this.tree.treeModel.update();
  }

  remove() {
    let _node = this.tree.treeModel.getActiveNode();

    let serarchData = {
      pkid: _node.id,
      comp_code: this.gs.globalVariables.comp_code,
      table_name: this.table_name
    }
    this.ms.deleteGroup(serarchData).subscribe(
      response => {
        this.deleteNode();
      },
      error => {
        this.ms.ErrorMessage = this.gs.getError(error);
        alert(this.ms.ErrorMessage);
      }

    )
  }

  deleteNode(): void {
    let _node = this.tree.treeModel.getActiveNode();
    if (_node.parent != null) {
      _node.parent.data.children.splice(_node.parent.data.children.indexOf(_node.data), 1);
      this.tree.treeModel.update();
    }
  }

  addNodes(node: TreeNode) {
  }

  LovSelected(_Record: SearchTable) {
  }

  ActionHandler(action: string, id: string, tname : string = '') {
  
    this.ms.ErrorMessage = "";
    this.ms.InfoMessage = "";

    if (action == 'LIST') {
      this.tab = 'LIST';
    }
    if (action == 'EDIT') {
      this.tab = 'DETAILS';
      this.ms.table_name = id;
      this.table_name =  id;
      this.tab_name = tname;
      this.loadTree();
    }

  }

  Close() {
    this.gs.ClosePage('home');
  }

  SelectCheckbox() {
  }

}

