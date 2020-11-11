
import { GlobalVariables } from '../../core/models/globalvariables';

export class Pim_Groupm {
    grp_pkid: string;
    grp_parent_id: string;
    grp_level: number;
    grp_name: string;
    grp_level_slno: number;
    grp_level_id: string;
    grp_level_name: string;
    grp_table_name: string;
    rec_mode: string;
    rec_category: string;
    rec_deleted: boolean;
    rec_hidden: boolean;
    rec_type: string;
    _globalvariables: GlobalVariables;
}

export class Pim_Docm {
    doc_pkid: string;

    doc_store_id: string;
    doc_store_name: string;

    doc_grp_id: string;
    doc_grp_name: string;

    doc_grp_level_name: string;
    
    doc_table_name: string;
    doc_language: string;

    doc_slno: number;
    doc_name: string;
    doc_file: File;
    doc_file_name: string;
    doc_file_uploaded : boolean;
    doc_thumbnail: string;
    doc_server_folder: string;

    rec_mode: string;
    rec_deleted: boolean;
    _globalvariables: GlobalVariables;
}

