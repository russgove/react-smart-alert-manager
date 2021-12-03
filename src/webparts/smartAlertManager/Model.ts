export interface SmartAlert{
   SAListId:string;//id of the list the alert is on
   SAColumnName:string;// id of the field to which emails are sent
   SAMessageSubject:string;// text template of the email subjecy
   SAMessageText:string;// text template of the email body
   SAChangeToken:string;
   SACCOriginator:boolean;// cc person who edited item
   Id:number;//item id of the alert
   
}