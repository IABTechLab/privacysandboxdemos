privacy-sandbox

## Purpose
The purpose of this project is to provide tools to help organizations learn privacy sandbox in order to enable them to test privacy sandbox as part of the UK CMA's Investigation into Google's Privacy Sandbox browser changes. See https://www.gov.uk/cma-cases/investigation-into-googles-privacy-sandbox-browser-changes for more details. 


## Browser setup
Validate that you have not disabled any Chrome APIs in your local browser. Open the following URL in chrome:
chrome://flags/#privacy-sandbox-ads-apis


## Observe events
https://developer.chrome.com/blog/fledge-api/#observe-fledge-events and monitor console logs & network activity panel to see the demo in action.


Install a Chrome browser extension like HTTP-TRACKER to be able to see network calls from within worklets (e.g. calls to K/V servers, forDebuggingEndpoints, etc.)
In Chrome M119 and higher, these are visible in the network tab directly

Install a Chrome browser extension like Custom-User-Agent to be able to append FLEDGE_GAM_EXTERNAL_TESTER to your User-Agent header to ensure that GAM/GPT run PA auctions (cf. https://services.google.com/fb/forms/uastringformultisellertestsignup/)


## Contributions:
Contributions are welcome. For static resources, please add them to the resources tab, for all other demos, feel free to copy one of the demo directories. Note that there is a lot of repetition and some old cruft in the directories. This is because it was used to figure Sandbox out, while the duplication was done to try and make it understandable for others going down the same path. Please note that contributions must meet the IABTechLab requirements documented at: https://iabtechlab.com/opensource/

