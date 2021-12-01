Import-Module "Microsoft.Online.SharePoint.Powershell"
$site_script=Get-Content -LiteralPath "C:\Users\trwg1\react-smart-alert-manager\assets\SmartAlertsSiteScript.json" -raw
##$site_script 

## NTO GET THE PAGE CONTENT GO TO /_api/web/getFileByServerRelativeUrl('/sites/<PATH>/<TO>/<THE>/SitePages/MyPage.aspx')/$value
## see https://sharepoint.stackexchange.com/questions/255954/provisioning-spfx-webpart-assets-adding-a-page-with-your-webpart-embedded-to-it
## THE FEATURE ID IN PACKAGE SOLUTION MUST BE THE id OF THE WEBPART FROM MANIFEST.XML
$adminSiteUrl = "https://russellwgove-admin.sharepoint.com"
Connect-SPOService $adminSiteUrl
Add-SPOSiteScript  `
 -Title "Create customer tracking list" `
 -Content $site_script `
 -Description "Creates list for tracking customer contact information" 