
import { GlobalVariables } from '../../core/models/globalvariables';


export class tablesm {
    tab_pkid: string;
    tab_name: string;
    tab_table_name: string;
    tab_caption: string;
    tab_id: string;
    tab_group: string;
    tab_sku: string;
    tab_file: string;

    tab_sku_duplication: boolean;
    tab_store_duplication: boolean;

    rec_mode: string;
    _globalvariables: GlobalVariables;
}

export class tablesd {
    tabd_pkid: string;
    tabd_parent_id: string;
    tabd_thumbnail  :string ;    
    tabd_tab_name: string;
    tabd_table_name: string;
    tabd_col_name: string;
    tabd_col_caption: string;
    tabd_col_type: string;
    tabd_col_rows : number;
    tabd_col_len: number;
    tabd_col_dec: number;
    tabd_col_mandatory: string;
    tabd_col_case: string;
    tabd_col_id: string;
    tabd_col_value: string;
    tabd_col_list: string;
    tabd_col_order: number;

    tabd_col_file: File;

    rec_mode: string;
    rec_deleted : boolean;
    _globalvariables: GlobalVariables;
}
