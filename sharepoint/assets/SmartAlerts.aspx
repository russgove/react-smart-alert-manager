<%@ Page language="C#" Inherits="Microsoft.SharePoint.WebControls.ClientSidePage, Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
    <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
        <html xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

        <head>
            <!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef,ClientSideApplicationId,PageLayoutType,CanvasContent1,BannerImageUrl,BannerImageOffset,PromotedState,FirstPublishedDate,LayoutWebpartsContent,_TopicHeader,_SPSitePageFlags,_SPAssetFolderId,_SPCallToAction"><xml>
<mso:CustomDocumentProperties>
<mso:PageLayoutType msdt:dt="string">Article</mso:PageLayoutType>
<mso:CanvasContent1 msdt:dt="string">&lt;div&gt;&lt;div data-sp-canvascontrol=&quot;&quot; data-sp-canvasdataversion=&quot;1.0&quot; data-sp-controldata=&quot;&amp;#123;&amp;quot;position&amp;quot;&amp;#58;&amp;#123;&amp;quot;zoneIndex&amp;quot;&amp;#58;1,&amp;quot;sectionIndex&amp;quot;&amp;#58;1,&amp;quot;controlIndex&amp;quot;&amp;#58;1,&amp;quot;layoutIndex&amp;quot;&amp;#58;1&amp;#125;,&amp;quot;controlType&amp;quot;&amp;#58;3,&amp;quot;id&amp;quot;&amp;#58;&amp;quot;c82b2dd4-23fc-4a22-9a8e-f175f4deab8f&amp;quot;,&amp;quot;webPartId&amp;quot;&amp;#58;&amp;quot;a1c87fdf-faad-4863-a4f4-a4a65c0f09b7&amp;quot;,&amp;quot;emphasis&amp;quot;&amp;#58;&amp;#123;&amp;#125;,&amp;quot;zoneGroupMetadata&amp;quot;&amp;#58;&amp;#123;&amp;quot;type&amp;quot;&amp;#58;0&amp;#125;,&amp;quot;reservedHeight&amp;quot;&amp;#58;550,&amp;quot;reservedWidth&amp;quot;&amp;#58;1180,&amp;quot;addedFromPersistedData&amp;quot;&amp;#58;true&amp;#125;&quot;&gt;&lt;div data-sp-webpart=&quot;&quot; data-sp-webpartdataversion=&quot;1.0&quot; data-sp-webpartdata=&quot;&amp;#123;&amp;quot;id&amp;quot;&amp;#58;&amp;quot;a1c87fdf-faad-4863-a4f4-a4a65c0f09b7&amp;quot;,&amp;quot;instanceId&amp;quot;&amp;#58;&amp;quot;c82b2dd4-23fc-4a22-9a8e-f175f4deab8f&amp;quot;,&amp;quot;title&amp;quot;&amp;#58;&amp;quot;SmartAlertManager&amp;quot;,&amp;quot;description&amp;quot;&amp;#58;&amp;quot;SmartAlertManager description&amp;quot;,&amp;quot;audiences&amp;quot;&amp;#58;[],&amp;quot;serverProcessedContent&amp;quot;&amp;#58;&amp;#123;&amp;quot;htmlStrings&amp;quot;&amp;#58;&amp;#123;&amp;#125;,&amp;quot;searchablePlainTexts&amp;quot;&amp;#58;&amp;#123;&amp;#125;,&amp;quot;imageSources&amp;quot;&amp;#58;&amp;#123;&amp;#125;,&amp;quot;links&amp;quot;&amp;#58;&amp;#123;&amp;#125;&amp;#125;,&amp;quot;dataVersion&amp;quot;&amp;#58;&amp;quot;1.0&amp;quot;,&amp;quot;properties&amp;quot;&amp;#58;&amp;#123;&amp;quot;description&amp;quot;&amp;#58;&amp;quot;SmartAlertManager&amp;quot;&amp;#125;&amp;#125;&quot;&gt;&lt;div data-sp-componentid=&quot;&quot;&gt;a1c87fdf-faad-4863-a4f4-a4a65c0f09b7&lt;/div&gt;&lt;div data-sp-htmlproperties=&quot;&quot;&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;&lt;div data-sp-canvascontrol=&quot;&quot; data-sp-canvasdataversion=&quot;1.0&quot; data-sp-controldata=&quot;&amp;#123;&amp;quot;controlType&amp;quot;&amp;#58;0,&amp;quot;pageSettingsSlice&amp;quot;&amp;#58;&amp;#123;&amp;quot;isDefaultDescription&amp;quot;&amp;#58;true,&amp;quot;isDefaultThumbnail&amp;quot;&amp;#58;true&amp;#125;&amp;#125;&quot;&gt;&lt;/div&gt;&lt;/div&gt;</mso:CanvasContent1>
<mso:ContentTypeId msdt:dt="string">0x0101009D1CB255DA76424F860D91F20E6C4118</mso:ContentTypeId>
<mso:ClientSideApplicationId msdt:dt="string">b6917cb1-93a0-4b97-a84d-7cf49975d4ec</mso:ClientSideApplicationId>
<mso:PromotedState msdt:dt="string">0</mso:PromotedState>
<mso:BannerImageUrl msdt:dt="string">/_layouts/15/images/sitepagethumbnail.png</mso:BannerImageUrl>
<mso:_TopicHeader msdt:dt="string"></mso:_TopicHeader>
<mso:LayoutWebpartsContent msdt:dt="string">&lt;div&gt;&lt;div data-sp-canvascontrol=&quot;&quot; data-sp-canvasdataversion=&quot;1.4&quot; data-sp-controldata=&quot;&amp;#123;&amp;quot;id&amp;quot;&amp;#58;&amp;quot;cbe7b0a9-3504-44dd-a3a3-0e5cacd07788&amp;quot;,&amp;quot;instanceId&amp;quot;&amp;#58;&amp;quot;cbe7b0a9-3504-44dd-a3a3-0e5cacd07788&amp;quot;,&amp;quot;title&amp;quot;&amp;#58;&amp;quot;Title area&amp;quot;,&amp;quot;description&amp;quot;&amp;#58;&amp;quot;Title Region Description&amp;quot;,&amp;quot;audiences&amp;quot;&amp;#58;[],&amp;quot;serverProcessedContent&amp;quot;&amp;#58;&amp;#123;&amp;quot;htmlStrings&amp;quot;&amp;#58;&amp;#123;&amp;#125;,&amp;quot;searchablePlainTexts&amp;quot;&amp;#58;&amp;#123;&amp;#125;,&amp;quot;imageSources&amp;quot;&amp;#58;&amp;#123;&amp;#125;,&amp;quot;links&amp;quot;&amp;#58;&amp;#123;&amp;#125;&amp;#125;,&amp;quot;dataVersion&amp;quot;&amp;#58;&amp;quot;1.4&amp;quot;,&amp;quot;properties&amp;quot;&amp;#58;&amp;#123;&amp;quot;title&amp;quot;&amp;#58;&amp;quot;Configure Smart Alerts`&amp;quot;,&amp;quot;imageSourceType&amp;quot;&amp;#58;4,&amp;quot;layoutType&amp;quot;&amp;#58;&amp;quot;NoImage&amp;quot;,&amp;quot;textAlignment&amp;quot;&amp;#58;&amp;quot;Left&amp;quot;,&amp;quot;showTopicHeader&amp;quot;&amp;#58;false,&amp;quot;showPublishDate&amp;quot;&amp;#58;false,&amp;quot;topicHeader&amp;quot;&amp;#58;&amp;quot;&amp;quot;,&amp;quot;enableGradientEffect&amp;quot;&amp;#58;true,&amp;quot;authors&amp;quot;&amp;#58;[],&amp;quot;authorByline&amp;quot;&amp;#58;[]&amp;#125;,&amp;quot;reservedHeight&amp;quot;&amp;#58;135&amp;#125;&quot;&gt;&lt;/div&gt;&lt;/div&gt;</mso:LayoutWebpartsContent>
<mso:_AuthorByline msdt:dt="string"></mso:_AuthorByline>
</mso:CustomDocumentProperties>
</xml></SharePoint:CTFieldRefs><![endif]-->
            <title>Configure Smart Alerts</title>
        </head>