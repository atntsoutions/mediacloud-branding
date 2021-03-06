import { GlobalVariables } from '../../core/models/globalvariables';


export class Companym {
    comp_pkid: string;
    comp_code: string;
    comp_name: string;
    comp_name2: string;
    comp_short_name: string;
    comp_type: string;
    comp_parent_id: string;
    comp_parent_name: string;

    comp_region_id: string;
    comp_region_name: string;

    comp_address1: string;
    comp_address2: string;
    comp_address3: string;

    comp_location: string;
    comp_district: string;
    comp_state: string;
    
    comp_tel: string;
    comp_fax: string;
    comp_web: string;
    comp_email: string;
    comp_ptc: string;
    comp_mobile: string;
    comp_prefix: string;
    comp_panno: string;
    comp_cinno: string;
    comp_gstin: string;
    comp_reg_address: string;
    comp_iata_code: string;
    comp_branch_type: string;
    comp_country_code: string;
    comp_pol_code: string;
    comp_order: number;
    comp_uamno: string;

    comp_approver_email: string;
    comp_receiver_email: string;

    comp_logo_name: string;
    comp_logo_file  : File;
    comp_logo_uploaded  : boolean;

    comp_image_name: string;
    comp_image_file  : File;
    comp_image_uploaded  : boolean;


    user_id : string;
    selected : boolean;

    rec_mode: string;
    _globalvariables: GlobalVariables;
}
