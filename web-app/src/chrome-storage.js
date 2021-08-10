//ESSENTIAL: Let ESLint know that we are accessing Chrome browser methods
/* global chrome */

/**
 * Retrieve object from Chrome's Local StorageArea
 * @param {string} key
 */
const getObjectFromLocalStorage = async function (key) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(key, function (value) {
        resolve(value[key]);
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

/**
 * Save Object in Chrome's Local StorageArea
 * @param {*} obj
 */
const saveObjectInLocalStorage = async function (obj) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(obj, function () {
        resolve();
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

/**
 * Removes Object from Chrome Local StorageArea.
 *
 * @param {string or array of string keys} keys
 */
const removeObjectFromLocalStorage = async function (keys) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.remove(keys, function () {
        resolve();
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

export {
  getObjectFromLocalStorage,
  saveObjectInLocalStorage,
  removeObjectFromLocalStorage,
};
