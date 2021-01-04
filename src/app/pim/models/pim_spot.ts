
import { GlobalVariables } from '../../core/models/globalvariables';


export class pim_spot {
    spot_pkid: string;

    spot_date : string;
    spot_slno : number;
    spot_req_no : string;

    spot_store_id : string;
    spot_store_name  : string;

    spot_vendor_id : string;
    spot_vendor_name  : string;
    spot_vendor_web  : string;

    spot_recce_id : string;
    spot_recce_name  : string;

    spot_region_id : string;
    spot_region_name  : string;

    spot_executive_name : string;
    spot_store_contact_name : string;
    spot_store_contact_tel : string;

    spot_job_remarks : string;

    spot_server_folder : string;

    spot_store_view : string;
    spot_store_view_file : File ;
    spot_store_view_file_uploaded : boolean ;

    spot_installation_view : string;
    spot_installation_view_file : File ;
    spot_installation_view_file_uploaded : boolean ;

    spot_request_send : string ;
    spot_approval_send : string ;


    rec_mode: string;


    approved_by: string;
    approved_status: string;
    approved_remarks: string;
    approved_date: string;

    show_window : boolean;

    _globalvariables: GlobalVariables;
}


export class pim_spotd {
    spotd_pkid: string;

    spotd_parent_id: string;
    spotd_name : string;
    spotd_slno : number;
    spotd_uom  : string;
    spotd_wd : number;
    spotd_ht : number;

    spotd_artwork_id : string;
    spotd_artwork_name : string;
    
    spotd_artwork_file_name : string;

    spotd_product_id : string;
    spotd_product_name : string;

    spotd_artwork_server_folder : string;
    spotd_server_folder : string;
    
    spotd_close_view : string;
    spotd_long_view  : string;
    spotd_final_view : string;

    spotd_close_view_file : File ;
    spotd_long_view_file : File;
    spotd_final_view_file : File;

    

    spotd_close_view_file_uploaded : boolean ;
    spotd_long_view_file_uploaded :  boolean ;
    spotd_final_view_file_uploaded :  boolean ;

    spotd_status: string;

    spotd_remarks: string;

    rec_mode: string;
    _globalvariables: GlobalVariables;
}


export class pim_spot_model {
    
    ErrorMessage = "";
    InfoMessage = "";

    tab : string ;
    pkid  : string;
    mode : string ;

    data_status : number;


    report = {filename : '',filetype : '',filedisplayname : ''};
  
    searchString = "";
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;
  
    RecordList : pim_spot [] =[];
    
    Record : pim_spot;
    RecordDet : pim_spotd []=[];

     
}

