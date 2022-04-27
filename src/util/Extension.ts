/// <reference types="chrome"/>

import Constants from "./Constants";

export enum ExtensionMessage {
  LoginEvent,
  LogoutEvent,
}

// TODO: not to be hardcoded
const extensionId = Constants.EXTENSION_ID;

const Extension = {
  sendMessage({
    messageType,
    payload = null,
  }: {
    messageType: ExtensionMessage;
    payload?: any;
  }) {
    return new Promise((resolve, reject) => {
      console.log("got to promise, chrome is: ", chrome);
      if (
        typeof chrome !== "undefined" &&
        chrome &&
        chrome.runtime &&
        chrome.runtime.sendMessage
      ) {
        console.log("connecting to extensino with id: ", extensionId);
        chrome.runtime.sendMessage(
          extensionId,
          {
            type: messageType,
            payload,
          },
          (response) => {
            const { lastError } = chrome.runtime;
            if (lastError || response?.error) {
              console.info(
                "Connecting to extension error: ",
                lastError?.message || response?.error
              );
              // 'Could not establish connection. Receiving end does not exist.'
            }
            resolve({ error: lastError, activated: !lastError });
          }
        );
      } else {
        resolve({ activated: false });
      }
    });
  },
};

export default Extension;
