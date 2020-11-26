
import { GlobalVariables } from '../../core/models/globalvariables';

export class mailhistory {
  mail_pkid: string;
  mail_date: string;
  mail_source: string;
  mail_source_id : string;
  mail_send_by : string;
  mail_send_to: string;
  mail_send_cc: string;
  mail_comments  : string;
  mail_files  : string;
  mail_refno  : string;
  mail_subject  : string;
  mail_message  : string;
  mail_process_id : number ;
  _globalvariables: GlobalVariables;
}
