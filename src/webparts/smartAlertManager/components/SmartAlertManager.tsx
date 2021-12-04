import { Label, PrimaryButton, TextField } from '@microsoft/office-ui-fabric-react-bundle';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp';
import { Fields, IFieldInfo, IFields } from "@pnp/sp/fields";
import { IListInfo, ILists, Lists } from "@pnp/sp/lists";
import { ISubscription, ISubscriptions, Subscriptions } from "@pnp/sp/subscriptions";
import { IWebs, Webs } from "@pnp/sp/webs";
import { IViewField, ListView } from '@pnp/spfx-controls-react/lib/controls/listView';
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
import { getIconClassName } from '@uifabric/styling';
import { filter, map, sample } from 'lodash';
import { ComboBox, IComboBox, IComboBoxOption } from 'office-ui-fabric-react/lib/ComboBox';
import { IColumn } from 'office-ui-fabric-react/lib/components/DetailsList';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { SmartAlert } from '../Model';
import { AlertEditor } from './AlertEditor';
import { ISmartAlertManagerProps } from './ISmartAlertManagerProps';
import styles from './SmartAlertManager.module.scss';

import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/subscriptions/list";
import "@pnp/sp/webs";

export const SmartAlertManager: React.FunctionComponent<ISmartAlertManagerProps> = (props) => {
  const [listInfos, setListInfos] = useState<IListInfo[]>();
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>();
   const [refresh, setRefresh] = useState<boolean>(false);
  const [mode, setMode] = useState<"showselected" | "display" | "addalert">('display');
 
  const viewFieldsSmartAlerts: any[] = [
    {
      name: 'actions', minWidth: 50, maxWidth: 50, displayName: 'Actions',
      render: (item?: SmartAlert, index?: number) => {
        return <div>
          <i className={getIconClassName('Delete')}
            onClick={async (e) => {
              debugger;
              var listId = await sp.web.lists.getByTitle(props.smartAlertsListId).items.getById(item.Id).get()
                .then((sa) => {
                  return sa["SAListId"];
                })
                .catch((err) => {
                  console.error(err);
                  return null;
                });
              debugger;
              sp.web.lists.getByTitle(props.smartAlertsListId).items.getById(item.Id).delete()
                .then(async () => {
                  debugger;
                  // if its the last alert on the list delet the subscriptopm
                  var remainingAlerts = await sp.web.lists.getByTitle(props.smartAlertsListId).items.filter(`SAListId eq '${listId}'`).get();
                  if (remainingAlerts.length === 0) {
                    // delete the subscriptipn (gotta get it first!)
                    debugger;
                    var subscriptionId = await
                      sp.web.lists.getById(listId)
                        .subscriptions
                        .filter(`notificationUrl eq '${props.endpointUrl}'`)
                        .get()
                        .then((value) => {
                          return value[0]["id"];
                        });
                    await
                      sp.web.lists.getById(listId)
                        .subscriptions
                        .getById(subscriptionId)
                        .delete()
                        .then((value) => {

                          alert(`Smart alert deleted. No other alerts are present on the list. Subscription deleted.`);
                          setRefresh(!refresh);
                        }).catch((err) => {

                          alert(`Smart alert deleted, but there was an error deleting the subscription`);
                          setRefresh(!refresh);
                        });

                  }
                  else {
                    debugger;
                    alert(`Smart alert deleted. Other alerts are still present on the list`);
                    setRefresh(!refresh);
                  }
                })
                .catch(error => {
                  console.error(error);
                  alert(`Error deleting smart alert`);
                  alert(error);
                });

            }}></i>
          &nbsp;&nbsp;    &nbsp;&nbsp;    &nbsp;&nbsp;
          <i className={getIconClassName('Edit')} onClick={(x) => {
            setMode("showselected");
          }}></i>
        </div>;
      }
    },
    { name: 'SAChangeToken', minWidth: 80, maxWidth: 120, displayName: 'Change Token', sorting: true, isResizable: true },
    {
      name: 'SAListId', minWidth: 80, maxWidth: 120, displayName: 'List', sorting: true, isResizable: true,
      render: (item?: SmartAlert, index?: number) => {

        var list = filter(listInfos, (li) => li.Id === item.SAListId);
        if (list.length > 0) {
          return list[0].Title;
        } else {
          return item.SAListId;
        }

      }
    },
    {
      name: 'SAColumnName', minWidth: 80, maxWidth: 120, displayName: 'Column', sorting: true, isResizable: true, render: (item?: SmartAlert, index?: number) => {

        var list = filter(listInfos, (li) => li.Id === item.SAListId);
        if (list.length > 0) {
          var column = filter(list[0].Fields, (fi) => fi.Id === item.SAColumnName);
          if (column.length > 0) {
            return column[0].Title;
          }
          else {
            return item.SAColumnName;
          }
        }
        else {
          return item.SAColumnName;
        }
      }
    },
    { name: 'SAMessageText', minWidth: 80, maxWidth: 120, displayName: 'Message', sorting: true, isResizable: true },
    // {
    //   name: 'ss', minWidth: 80, maxWidth: 120, displayName: 'Alerts', sorting: true,
    //   isResizable: true,
    //   render: (item?: any, index?: number) => {

    //     var listinfo = listInfos[index];
    //     var count = 0;
    //     for (var sub of listinfo['Subscriptions']) {
    //       if (sub.notificationUrl === props.endpointUrl) {
    //         count++;
    //       }


    //     }
    //     return <div>{count}</div>;

    //   }
    // },

  ];



  //https://13ac-162-83-141-149.ngrok.io/api/SharePointListNotifications

  //filter(`Subscriptions/notificationUrl eq ${props.endpointUrl}`).
  // this just shows which list shave subscriptrion, not which have been configured
  useEffect(() => {
    sp.web.lists
      .expand("subscriptions,fields")
      .select("Id,Title,Description,CurrentChangeToken,subscriptions/*,fields/*")
      .filter(`Hidden eq false`)// and Subscriptions/notificationUrl eq ${props.endpointUrl}`)
      .get().then((lists) => {
        for (var list of lists) {
          for (var subscription of list['Subscriptions']) {
            console.log(subscription['clientState']);
          }
        }
        setListInfos(lists);
      });
  }, [refresh]);
  useEffect(() => {
    sp.web.lists
      .getByTitle(props.smartAlertsListId)
      .items
      .get()
      .then((alerts) => {
        debugger;
        setSmartAlerts(map(alerts, a => {
          return {
            SACCOriginator: false,
            SAMessageSubject: a["SAMessageSubject"],
            SAMessageText: a["SAMessageText"],
            SAListId: a["SAListId"],
            SAColumnName: a["SAColumnName"],
            SAChangeToken: a["SAChangeToken"],
            Id: a["Id"]
          };
        }));
      })
      .catch((e) => {
        debugger;
        //setSmartAlerts(map(alerts,a=>{return{ccOwner:false,email:a.}}));
      });

  }, [refresh]);
 return <div>
    <ListView items={smartAlerts} viewFields={viewFieldsSmartAlerts}></ListView>
    <PrimaryButton onClick={(e) => {
      setMode("addalert");
    }}>Add Smart Alert</PrimaryButton>
       {/* ******************************************* ADD AN ALERT ******************************** */}
    {(mode === "addalert") &&
      <AlertEditor 
      endpointUrl={props.endpointUrl} 
      smartAlertsListId={props.smartAlertsListId}
      listInfos={listInfos}
      onDismiss={() => {
        setRefresh(!refresh);
        setMode("display");
        
                  
      }}
       />
    }
  </div>;
};