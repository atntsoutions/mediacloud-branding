
import { GlobalVariables } from '../../core/models/globalvariables';
import { Userd } from './userd';

export class User {
    user_pkid: string;
    user_code: string;
    user_name: string;

    user_parent_id: string;
    user_parent_name: string;

    user_email: string;
    user_password: string;
    user_company_id: string;
    user_branch_id: string;
    user_branch_name: string;
    user_rights_total: number;
    user_branch_user: boolean;
    user_sman_id: string;
    user_sman_code: string;
    user_sman_name: string;
    user_email_pwd: string;
    user_local_server: string;

    user_role_id: string;
    user_role_name: string;
    user_role_rights_id: string;    


    user_vendor_id: string;
    user_vendor_name: string;

    user_region_id: string;
    user_region_name: string;


    rec_mode: string;

    _globalvariables: GlobalVariables;

    RecordDet: Userd[] = [];

}
