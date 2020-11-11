import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges , HostListener} from '@angular/core';


@Component({
    selector: 'InputBox',
    templateUrl: './inputbox.component.html'
})


export class InputBoxComponent {

    @Input() inputModel: string;
    
    @Input() disabled: boolean = false;
    @Input() maxlength: number = 1;

    @Input() rows: number = 1;

    @Input() uppercase: boolean = false;
    @Input() lowercase: boolean = false;

    @Input() case = 'N';

    @Input() field: string;
    @Input() rec: any;

    @Output() inputModelChange = new EventEmitter<string>();
    @Output() blur = new EventEmitter<{field : string , rec : any}>();

    @ViewChild('inputbox',{static:true}) private inputbox: ElementRef;

    constructor() {
    }

    ngOnInit() {

    }

    onBlur1($event) {
        if (this.inputModel != null) {
            if (this.uppercase || this.case  =='U' ) {
                this.inputModel = this.inputModel.toUpperCase();

            }
            else if (this.lowercase|| this.case  =='L' ) {
                this.inputModel = this.inputModel.toLowerCase();
            }
        }
        this.inputModelChange.emit(this.inputModel);        
        if ( this.blur)
        {
            this.blur.emit({ field: this.field,rec: this.rec});        
        }
    }

    public focus() {
        if (!this.disabled)
          this.inputbox.nativeElement.focus();
      }

}
