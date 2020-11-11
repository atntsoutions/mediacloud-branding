import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges, HostListener } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'InputFile',
    templateUrl: './inputfile.component.html'
})


export class InputFileComponent {

    @Input() fileType: string = 'image/*';
    @Input() disabled: boolean = false;

    @Input() fileName: string = '';

    @Input() serverFolder: string = '';

    // File Content
    @Output() fileChanged = new EventEmitter<File>();
    // File Name
    @Output() fileNameChanged = new EventEmitter<string>();
    // Is File Uploaded
    @Output() fileUploaded = new EventEmitter<boolean>();

    @ViewChild('inputbox', { static: true }) private inputbox: ElementRef;


    constructor(private modalService: NgbModal) {
    }

    ngOnInit() {

    }



    getFileDetails(e: any) {
        let isValidFile = true;
        let fname: string = '';

        for (var i = 0; i < e.target.files.length; i++) {
            fname = e.target.files[i].name;

            if (fname.indexOf('&') >= 0)
                isValidFile = false;
            if (fname.indexOf('%') >= 0)
                isValidFile = false;
            if (fname.indexOf('#') >= 0)
                isValidFile = false;

            this.fileName = fname;
            this.fileChanged.emit(e.target.files[i]);
            this.fileNameChanged.emit(fname);
            this.fileUploaded.emit(true);
        }

        if (!isValidFile) {

            this.fileChanged.emit(null);
            this.fileNameChanged.emit('');
            alert('Invalid File Name - &%#');
        }
    }

    showImage(content) {
        this.modalService.open(content, { centered: true });
    }



    public focus() {
        if (!this.disabled)
            this.inputbox.nativeElement.focus();
    }

    setMyStyles() {
        let styles = {
          'border': '1px solid rgba(0,0,255,0.25)',
          'margin-left': '0px',
          'border-radius': '0px',
        };
        return styles;
      }


}
