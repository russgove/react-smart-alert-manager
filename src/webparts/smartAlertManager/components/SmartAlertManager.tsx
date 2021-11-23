import { Label, PrimaryButton } from '@microsoft/office-ui-fabric-react-bundle';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp';
import { Fields, IFieldInfo, IFields } from "@pnp/sp/fields";
import { IListInfo, ILists, Lists } from "@pnp/sp/lists";
import { ISubscription, ISubscriptions, Subscriptions } from "@pnp/sp/subscriptions";
import { IWebs, Webs } from "@pnp/sp/webs";
import { IViewField, ListView } from '@pnp/spfx-controls-react/lib/controls/listView';
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
import { getIconClassName } from '@uifabric/styling';
import { filter } from 'lodash';
import { ComboBox, IComboBox, IComboBoxOption } from 'office-ui-fabric-react/lib/ComboBox';
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
  const [userField, setUserField] = useState<IComboBoxOption>();
  const [mailText, setMailText] = useState<string>();
  const [selectedList, setSelectedList] = useState<IListInfo>();
  const [mode, setMode] = useState<"showselected" | "display" | "addalert">('display');
  const viewFieldsSubscriptions: any[] = [
    {
      name: 'actions', minWidth: 50, maxWidth: 50, displayName: 'Actions', render: (item?: IListInfo, index?: number) => {
        return <div>
          {/* <i className={getIconClassName('Redo')}
            onClick={async (e) => {
              debugger;
              const url = `${parentContext.managementApiUrl}/api/EnqueueCallbackItems`;
              const selected = [item];
              await fetchAZFunc(parentContext.aadHttpClient, url, "POST", JSON.stringify(selected));
              alert(`${selected.length} files where queued`);
            }}></i>
          &nbsp;&nbsp;    &nbsp;&nbsp;    &nbsp;&nbsp; */}
          <i className={getIconClassName('View')} onClick={(x) => {

            // setSelectedList(filter(listInfos,(li)=>{return li.Id===item.Id})[0]);
            // setMode("showselected");

          }}></i>
        </div>;
      }
    },
    { name: 'notificationUrl', minWidth: 100, maxWidth: 200, displayName: 'notificationUrl', sorting: true, isResizable: true },

    { name: 'expirationDateTime', minWidth: 80, maxWidth: 120, displayName: 'Expires', sorting: true, isResizable: true },
    { name: 'id', minWidth: 80, maxWidth: 120, displayName: 'ID', sorting: true, isResizable: true },
    { name: 'resource', minWidth: 80, maxWidth: 120, displayName: 'Resource', sorting: true, isResizable: true },
    { name: 'clientState', minWidth: 80, maxWidth: 120, displayName: 'CLientSTate', sorting: true, isResizable: true },

  ];
  const viewFieldsCallbackItems: any[] = [
    {
      name: 'actions', minWidth: 50, maxWidth: 50, displayName: 'Actions', render: (item?: any, index?: number) => {
        return <div>
          {/* <i className={getIconClassName('Redo')}
            onClick={async (e) => {
              debugger;
              const url = `${parentContext.managementApiUrl}/api/EnqueueCallbackItems`;
              const selected = [item];
              await fetchAZFunc(parentContext.aadHttpClient, url, "POST", JSON.stringify(selected));
              alert(`${selected.length} files where queued`);
            }}></i>
          &nbsp;&nbsp;    &nbsp;&nbsp;    &nbsp;&nbsp; */}
          <i className={getIconClassName('View')} onClick={(x) => {

            setSelectedList(filter(listInfos, (li) => {
               return li.Id === item.Id;
             })[0]);

            setMode("showselected");

          }}></i>
        </div>;
      }
    },
    { name: 'Title', minWidth: 100, maxWidth: 200, displayName: 'Title', sorting: true, isResizable: true },

    { name: 'Description', minWidth: 80, maxWidth: 120, displayName: 'Description', sorting: true, isResizable: true },
    {
      name: 'ss', minWidth: 80, maxWidth: 120, displayName: 'Alerts', sorting: true,
      isResizable: true,
      render: (item?: any, index?: number) => {

        var listinfo = listInfos[index];
        var count = 0;
        for (var sub of listinfo['Subscriptions']) {
          if (sub.notificationUrl === props.endpointUrl) {
            count++;
          }


        }
        return <div>{count}</div>;

      }
    },

  ];
  const getPeopleFields = (): IComboBoxOption[] =>{
    debugger;
    const xx = selectedList['Fields']
      .filter(f => {
        return f.TypeAsString === "User";
      })
      .map(f => {
        return ({
          key: f.Id,
          id: f.Id,
          text: f.Title,
          title: f.Title
        });
      });
    return xx;
  };
  //https://13ac-162-83-141-149.ngrok.io/api/SharePointListNotifications

  //filter(`Subscriptions/notificationUrl eq ${props.endpointUrl}`).
  useEffect(() => {
    sp.web.lists
      .expand("subscriptions,fields")
      .select("Id,Title,Description,subscriptions/*,fields/*")
      .filter(`Hidden eq false`)// and Subscriptions/notificationUrl eq ${props.endpointUrl}`)
      .get().then((lists) => {

        setListInfos(lists);
      });

  }, []);
const userFields=selectedList? getPeopleFields():[];
  return <div>
    <ListView items={listInfos} viewFields={viewFieldsCallbackItems}></ListView>
    {(mode === "showselected" || mode === "addalert") &&
      <Panel type={PanelType.extraLarge}
        headerText={`Smart Alerts for ${selectedList.Title}`}
        isOpen={mode === "showselected"}
        onDismiss={(e) => {
          setMode("display");
        }} >
        <ListView
          items={filter(listInfos, (li) => {

            return li.Id === selectedList.Id;
          })[0]['Subscriptions']}
          viewFields={viewFieldsSubscriptions}
        //  stickyHeader={true}
        ></ListView>
        <PrimaryButton onClick={(e) => { 
          setMode("addalert");
       }}>Add Smart Alert</PrimaryButton>
      </Panel>
    }
    {(mode === "addalert") &&
      <Panel type={PanelType.medium}
        headerText={`Add Smart Alert to  ${selectedList.Title}`}
        isOpen={mode === "addalert"}
        onDismiss={(e) => {
          setMode("showselected");
        }} >
        <ComboBox label="User to recieve alerts"
    selectedKey={userField?userField.id:null}
           options={userFields} 
           onChange={(e, option?: IComboBoxOption, index?: number, value?: string) =>{
          debugger;
         setUserField(option);
        }}></ComboBox>
        <Label>Email Text</Label>

        <RichText  isEditMode={true} value='' placeholder={`Text of Smart Alert email`} onChange={(e) => {
          debugger;
         // setMailText(e);
          return e;
        }} />
        <DatePicker  label="ExpirationDate"></DatePicker>
        <PrimaryButton onClick={(e) => {
          debugger;
          sp.web.lists.getById(selectedList.Id).subscriptions.add(props.endpointUrl,"2021-12-31T23:00:00+00:00",`{"Field":"${userField.id}","MailText":"${mailText}"}`)
          .then((value)=>{
            debugger;
          })
          .catch((error)=>{
            debugger;
          });

        }}>save</PrimaryButton>
      </Panel>
    }
  </div>;
};