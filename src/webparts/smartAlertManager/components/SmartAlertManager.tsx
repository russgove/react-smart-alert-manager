import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp';
import { IListInfo, ILists, Lists } from "@pnp/sp/lists";
import { ISubscription, ISubscriptions, Subscriptions } from "@pnp/sp/subscriptions";
import { IWebs, Webs } from "@pnp/sp/webs";
import { IViewField, ListView } from '@pnp/spfx-controls-react/lib/controls/listView';
import { IColumn } from 'office-ui-fabric-react/lib/components/DetailsList';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { ISmartAlertManagerProps } from './ISmartAlertManagerProps';
import styles from './SmartAlertManager.module.scss';

import "@pnp/sp/lists";
import "@pnp/sp/subscriptions/list";
import "@pnp/sp/webs";

export const SmartAlertManager: React.FunctionComponent<ISmartAlertManagerProps> = (props) => {
  const [listInfos, setListInfos] = useState<IListInfo[]>();
  const viewFieldsCallbackItems: any[] = [
    //{
    //   name: 'actions', minWidth: 50, maxWidth: 50, displayName: 'Actions', render: (item?: any, index?: number) => {
    //     return <div>
    //       <i className={getIconClassName('Redo')}
    //         onClick={async (e) => {
    //           debugger;
    //           const url = `${parentContext.managementApiUrl}/api/EnqueueCallbackItems`;
    //           const selected = [item];
    //           await fetchAZFunc(parentContext.aadHttpClient, url, "POST", JSON.stringify(selected));
    //           alert(`${selected.length} files where queued`);
    //         }}></i>
    //       &nbsp;&nbsp;    &nbsp;&nbsp;    &nbsp;&nbsp;
    //       <i className={getIconClassName('View')} onClick={(e) => {
    //         debugger;
    //         setSelectedCallbackItem(item);
    //         setMode("showselected");

    //       }}></i>
    //     </div>;
    //   }
    // },
    { name: 'Title', minWidth: 100, maxWidth: 200, displayName: 'Title', sorting: true, isResizable: true },

    { name: 'Description', minWidth: 80, maxWidth: 120, displayName: 'Description', sorting: true, isResizable: true },
    {
      name: 'ss', minWidth: 80, maxWidth: 120, displayName: 'Alerts', sorting: true,
      isResizable: true,
      render: (item?: any, index?: number) => {
        debugger;
        var listinfo=listInfos[index];
        var count=0;
        for(var sub of listinfo['Subscriptions'] )
        {
          if (sub.notificationUrl === props.endpointUrl) {
            count++;
          } 


        }
        return <div>{count}</div>;

      }
    },

  ];
//https://5f47-162-83-141-149.ngrok.io/api/SharePointListNotifications

  //filter(`Subscriptions/notificationUrl eq ${props.endpointUrl}`).
  useEffect(() => {
    sp.web.lists
    .expand("subscriptions")
    .select("Id,Title,Description,subscriptions/*") 
    .filter(`Hidden eq false`)// and Subscriptions/notificationUrl eq ${props.endpointUrl}`)
    .get().then((lists) => {
      debugger;
      setListInfos(lists);
    });

  }, []);
  return <div>
    <ListView items={listInfos} viewFields={viewFieldsCallbackItems}></ListView>

  </div>;
};