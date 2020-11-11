import { GlobalVariables } from '../../core/models/globalvariables';
export class Campaign {
    cam_pkid: string;
    cam_name: string;
    cam_tab_id: string;
    cam_tab_name: string;

    tab_campaign_table     : boolean;

    cam_type: string;
    cam_store: string;

    user_is_admin : string ;

    cam_product_name: string;
    cam_product_name_values: string;

    cam_size: string;
    cam_size_values: string;
    cam_aep: string;
    cam_aep_values: string;
    cam_output: string;
    cam_output_values: string;
    
    cam_approver: string;
    cam_receiver: string;
    
    cam_logo: string;
    cam_image1: string;
    cam_image2: string;
    cam_image3: string;
    cam_image4: string;
    cam_image5: string;
    
    cam_text1: string;
    cam_text1_values: string;
    cam_text2: string;
    cam_text2_values: string;
    cam_text3: string;
    cam_text3_values: string;
    cam_text4: string;
    cam_text4_values: string;
    cam_text5: string;
    cam_text5_values: string;

    rec_mode: string;
    _globalvariables: GlobalVariables;
}
