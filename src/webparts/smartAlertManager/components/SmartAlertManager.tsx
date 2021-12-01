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

import { filter, map } from 'lodash';
import { ComboBox, IComboBox, IComboBoxOption } from 'office-ui-fabric-react/lib/ComboBox';
import { IColumn } from 'office-ui-fabric-react/lib/components/DetailsList';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import "@pnp/sp/items";
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { SmartAlert } from '../Model';
import { ISmartAlertManagerProps } from './ISmartAlertManagerProps';
import styles from './SmartAlertManager.module.scss';

import "@pnp/sp/lists";
import "@pnp/sp/subscriptions/list";
import "@pnp/sp/webs";

export const SmartAlertManager: React.FunctionComponent<ISmartAlertManagerProps> = (props) => {
  const [listInfos, setListInfos] = useState<IListInfo[]>();
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>();
  const [userField, setUserField] = useState<IComboBoxOption>();
  const [mailText, setMailText] = useState<string>();
  const [selectedList, setSelectedList] = useState<IListInfo>();
  const [refresh, setRefresh] = useState<boolean>(false);
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
                  return null;
                })
              debugger;
              sp.web.lists.getByTitle(props.smartAlertsListId).items.getById(item.Id).delete()
                .then(async xx => {
                  debugger;
                  // if its the last alert on the list delet the subscriptopm
                  var remainingAlerts = await sp.web.lists.getByTitle(props.smartAlertsListId).items.filter(`SAListId eq '${listId}'`).get();
                  if (remainingAlerts.length === 0) {
                    // delete the subscroiptin (gotta get it first!)
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
          <i className={getIconClassName('View')} onClick={(x) => {
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
      name: 'SAColumnId', minWidth: 80, maxWidth: 120, displayName: 'Column', sorting: true, isResizable: true, render: (item?: SmartAlert, index?: number) => {

        var list = filter(listInfos, (li) => li.Id === item.SAListId);
        if (list.length > 0) {
          var column = filter(list[0].Fields, (fi) => fi.Id === item.SAColumnId);
          if (column.length > 0) {
            return column[0].Title;
          }
          else {
            return item.SAColumnId;
          }
        }
        else {
          return item.SAColumnId;
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
  const getPeopleFields = (): IComboBoxOption[] => {
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
  const getListOptions = (): IComboBoxOption[] => {
    debugger;
    const xx = listInfos
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
            SAMessageText: a["SAMessageText"],
            SAListId: a["SAListId"],
            SAColumnId: a["SAColumnId"],
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

  const userFields = selectedList ? getPeopleFields() : [];
  return <div>
    <ListView items={smartAlerts} viewFields={viewFieldsSmartAlerts}></ListView>
    <PrimaryButton onClick={(e) => {
      setMode("addalert");
    }}>Add Smart Alert</PrimaryButton>
    {(mode === "showselected") &&
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
        headerText={`Add a Smart Alert`}
        isOpen={mode === "addalert"}
        onDismiss={(e) => {
          setMode("display");
        }} >


        <ComboBox label="Select a List"
          selectedKey={selectedList ? selectedList.Id : null}
          options={getListOptions()}
          onChange={(e, option?: IComboBoxOption, index?: number, value?: string) => {
            debugger;
            setSelectedList(filter(listInfos, (li) => li.Id === option.id)[0]);
          }}></ComboBox>

        <ComboBox label="User to recieve alerts"
          selectedKey={userField ? userField.id : null}
          options={userFields}
          onChange={(e, option?: IComboBoxOption, index?: number, value?: string) => {
            debugger;
            setUserField(option);
          }}></ComboBox>
        <Label>Email Text</Label>

        <RichText value={mailText}
          onChange={(e) => {
            debugger;
            setMailText(e);
            return e;
          }} />
        <DatePicker label="ExpirationDate"></DatePicker>
        <PrimaryButton onClick={(e) => {
          debugger;
          sp.web.lists.getById(selectedList.Id).subscriptions.add(props.endpointUrl, "2021-12-31T23:00:00+00:00", `${props.smartAlertsListId}`)
            .then((value) => {
              //TODO: set timestamp
              sp.web.lists.getByTitle(props.smartAlertsListId).items.add({
                "Title": `${selectedList.Id}`,
                "SAChangeToken": `${selectedList.CurrentChangeToken.StringValue}`,
                "SAColumnId": `${userField.id}`,
                "SAMessageText": `${mailText}`,
                "SAListId": `${selectedList.Id}`,
              })
                .then(item => {
                  debugger;

                  alert(`Smart alert added`);
                  setSelectedList(null);
                  setUserField(null);
                  setMailText(null);
                  setRefresh(!refresh);
                  setMode("display");
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
    }
  </div>;
};