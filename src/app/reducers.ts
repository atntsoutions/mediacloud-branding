import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { Params, RouterStateSnapshot } from '@angular/router';


export interface AppState {
 router: fromRouter.RouterReducerState<any>;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
}

export const metaReducers: MetaReducer<AppState>[] = [];

export const selectRouter = createFeatureSelector<fromRouter.RouterReducerState<any>>('router');


export const SelectRouterParam = createSelector(
  selectRouter,
  (router) => {
    if (router.state) {
      return router.state.queryParams;
    }
    else
      return null;
  }
);


export const SelectRouterUrlId = createSelector(
  selectRouter,
  (router) => {
    if (router.state) {
      if (router.state.queryParams.urlid)
        return router.state.queryParams.urlid;
      else
        return null;
    }
    else
      return null;
  }
);


export const SelectRouterId = createSelector(
  selectRouter,
  (router) => {
    if (router.state) {
      return router.state.queryParams.id;
    }
    else
      return null;
  }
);

export const SelectRouterMenuId = createSelector(
  selectRouter,
  (router) => {
    if (router.state) {
      return router.state.queryParams.menuid;
    }
    else
      return null;
  }
);

export const SelectRouterMenuParam = createSelector(
  selectRouter,
  (router) => {
    if (router.state) {
      return router.state.queryParams.menu_param;
    }
    else
      return null;
  }
);


// Custom Router Serializer
export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export class CustomSerializer implements fromRouter.RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams },
    } = routerState;
    const { params } = route;

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return { url, params, queryParams };
  }
}

