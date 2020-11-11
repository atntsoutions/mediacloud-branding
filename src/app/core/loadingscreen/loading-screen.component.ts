
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LoadingScreenService } from '../services/loadingscreen.service';

import { Subscription, Observable } from "rxjs";
import { debounceTime, startWith, delay } from 'rxjs/operators';


@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  changeDetection : ChangeDetectionStrategy.Default
})
export class LoadingScreenComponent implements OnInit {

  msub : Observable<boolean>;
  constructor(
    private loadingScreenService: LoadingScreenService
    ) {}

  ngOnInit() {
    this.msub =  this.loadingScreenService.loadingStatus.pipe(
      startWith(false),
      delay(0)
    );
  }

  ngOnDestroy() {
  }

}
