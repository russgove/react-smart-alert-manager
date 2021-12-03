import { IListInfo } from "@pnp/sp/lists";
import { MemoVoidDictionaryIterator } from "lodash";

export interface IAlertEditorProps {
  endpointUrl: string;
  smartAlertsListId:string;
  listInfos:IListInfo[];
  onDismiss:()=>void;
}
