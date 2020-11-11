import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';

@Injectable()

export class Store {
  constructor(private gs: GlobalService) {
      this.store = {};
  }

  private store = {};

  clearAll(){
      this.store = {};
  }

  despath( id : string, payload : {}){
    this.store[id] = payload;
  }
  
  select (id : string ){
      return this.store[id];
  }

}


