import { ISmartAlertManagerProps } from './components/ISmartAlertManagerProps';
import { SmartAlertManager } from './components/SmartAlertManager';
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as strings from 'SmartAlertManagerWebPartStrings';

export interface ISmartAlertManagerWebPartProps {
  endpointUrl: string;
}

export default class SmartAlertManagerWebPart extends BaseClientSideWebPart<ISmartAlertManagerWebPartProps> {
  protected onInit():Promise<void>{
    sp.setup({
      spfxContext: this.context
    });
    return super.onInit();
  }
  public render(): void {
    const element: React.ReactElement<ISmartAlertManagerProps> = React.createElement(
      SmartAlertManager,
      {
        endpointUrl: this.properties.endpointUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('endpointUrl', {
                  label: strings.EndpointUrlFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
