export interface SmartAlert{
   SAListId:string;//id of the list the alert is on
   SAColumnId:string;// id of the field to which emails are sent
   SAMessageText:string;// text template of the email
   SAChangeToken:string;
   SACCOriginator:boolean;// cc person who edited item
   Id:number;//item id of the alert
   
}