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

import { filter, map } from 'lodash';
import { ComboBox, IComboBox, IComboBoxOption } from 'office-ui-fabric-react/lib/ComboBox';
import { IColumn } from 'office-ui-fabric-react/lib/components/DetailsList';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import "@pnp/sp/items";
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { SmartAlert } from '../Model';
import { IAlertEditorProps } from './IAlertEditorProps';
import styles from './SmartAlertManager.module.scss';

import "@pnp/sp/lists";
import "@pnp/sp/subscriptions/list";
import "@pnp/sp/webs";
import { Toggle } from 'office-ui-fabric-react';

export const AlertEditor: React.FunctionComponent<IAlertEditorProps> = (props) => {
debugger;
  const [userField, setUserField] = useState<IComboBoxOption>();
  const [mailSubject, setMailSubject] = useState<string>();
 const [mailText, setMailText] = useState<string>();
  const [selectedList, setSelectedList] = useState<IListInfo>();
  const [ccOriginator, setCCOriginator] = useState<boolean>();
  const getPeopleFields = (): IComboBoxOption[] => {
    debugger;
    const xx = selectedList['Fields']
      .filter(f => {
        return f.TypeAsString === "User";
      })
      .map(f => {
        return ({
          key: f.InternalName,
          id: f.InternalName,
          text: f.Title,
          title: f.Title
        });
      });
    return xx;
  };
  const getFieldsToInclude = (): IComboBoxOption[] => {
    debugger;
    const xx = selectedList['Fields']
      .filter(f => {
        return f.Hidden === false;
      })
      .map(f => {
        return ({
          key: f.InternalName,
          id: f.InternalName,
          text: f.Title,
          title: f.Title
        });
      });
    return xx;
  };
  const getListOptions = (): IComboBoxOption[] => {
    debugger;
    const xx = props.listInfos
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
  // this just shows which list shave subscriptrion, not which have been configured

  
  const userFields = selectedList ? getPeopleFields() : [];
  const fieldsToInclude = selectedList ? getFieldsToInclude() : [];

  return <div>
   
      <Panel type={PanelType.medium}
        headerText={`Add a Smart Alert`}
     isOpen={true}
        onDismiss={props.onDismiss} >


        <ComboBox label="Select a List"
          selectedKey={selectedList ? selectedList.Id : null}
          options={getListOptions()}
          onChange={(e, option?: IComboBoxOption, index?: number, value?: string) => {
            debugger;
            setSelectedList(filter(props.listInfos, (li) => li.Id === option.id)[0]);
          }}></ComboBox>

        <ComboBox label="User to recieve alerts"
          selectedKey={userField ? userField.id : null}
          options={userFields}
          onChange={(e, option?: IComboBoxOption, index?: number, value?: string) => {
            debugger;
            setUserField(option);
          }}></ComboBox>

        <TextField value={mailSubject}
          label="Email Subject"
          onChange={(e, newVal) => {
            debugger;
            setMailSubject(newVal);
            return e;
          }} />

        <Label>Email Text</Label>
        <RichText value={mailText}
          onChange={(e) => {
            debugger;
            setMailText(e);
            return e;
          }} />

<Toggle checked={ccOriginator}
          label="cc Originator"

          onChange={(e, newVal) => {
            debugger;
            setCCOriginator(newVal);
            return e;
          }} />
        <DatePicker label="ExpirationDate"></DatePicker>

        <Label>Tags to Include in Email Text</Label>
        <table>
          <th>
            <tr>
              <td>To inlude this field</td>
              <td>use this tag</td>
            </tr>

          </th>
          <tbody>
          {fieldsToInclude.map(f=>{
            debugger;
            return (<tr>
              <td>{f.title}</td>
              <td>&#123;{f.id}&#125;</td>
            </tr>);
          })}
          </tbody>
          
        </table>
        <PrimaryButton onClick={(e) => {
          debugger;
          sp.web.lists.getById(selectedList.Id).subscriptions.add(props.endpointUrl, "2021-12-31T23:00:00+00:00", `${props.smartAlertsListId}`)
            .then((value) => {
              //TODO: set timestamp
              sp.web.lists.getByTitle(props.smartAlertsListId).items.add({
                "Title": ``,
                "SAChangeToken": `${selectedList.CurrentChangeToken.StringValue}`,
                "SAColumnName": `${userField.id}`,
                "SAMessageSubject": `${mailSubject}`,
                "SACCOriginator":ccOriginator?true:false,
                "SAMessageText": `${mailText}`,
                "SAListId": `${selectedList.Id}`,
              })
                .then(item => {
                  debugger;

                  alert(`Smart alert added`);
                  setSelectedList(null);
                  setUserField(null);
                  setMailText(null);
                  props.onDismiss();
                  
                })
                .catch(error => {
                  console.error(error);
                  alert(`Error updating smart alerts list`);
                  alert(error);
                });

            })
            .catch((error) => {
              console.error(error);
              alert(`Error adding subscription`);
              alert(error);
              debugger;
            });

        }}>save</PrimaryButton>
      </Panel>
   
  </div>;
};