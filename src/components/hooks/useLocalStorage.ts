"use client";
import React, { use } from "react";
import { DoWork } from "@/app/api/cookie/route";

function dispatchStorageEvent(key: string, newValue: any) {
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
}

const setLocalStorageItem = (key: string, value: any) => {
  const stringifiedValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
};

const removeLocalStorageItem = (key: string) => {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
};

const getLocalStorageItem = (key: string) => {
  return window.localStorage.getItem(key);
};

const useLocalStorageSubscribe = (callback: any) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

async function getValueFromServer(key: string) {
//   console.log(await setValueOnServer(key, "test"));
  const data = await fetch("http://127.0.0.1:3000/api/cookie", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key, mode: "get" }),
  });
  const res = await data.json();
  console.log(res)
  return res.value;
}

async function setValueOnServer(key: string, value: any) {
  const data = await fetch("http://127.0.0.1:3000/api/cookie", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key, value, mode: "set" }),
  });
  const res = await data.json();
  return res;
}

const getLocalStorageServerSnapshot = (key: string) => {
  //   throw Error("useLocalStorage is a client-only hook");
  const value = use(getValueFromServer("test"));
  console.log(value);

  try {
    return getLocalStorageItem(key);
  } catch {
    return null;
  }
};

export default function useLocalStorage(key: string, initialValue: any) {
  const getLocalSnapshot = () => getLocalStorageItem(key);
  const getServerSnapshot = () => getLocalStorageServerSnapshot(key);
  const store = React.useSyncExternalStore(
    useLocalStorageSubscribe,
    getLocalSnapshot,
    getServerSnapshot
  );

  const setState = React.useCallback(
    (v: any) => {
      try {
        if (store === null) {
          setLocalStorageItem(key, v);
          return;
        }
        const nextState = typeof v === "function" ? v(JSON.parse(store)) : v;

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key);
        } else {
          setLocalStorageItem(key, nextState);
        }
      } catch (e) {
        console.warn(e);
      }
    },
    [key, store]
  );

  React.useEffect(() => {
    if (
      getLocalStorageItem(key) === null &&
      typeof initialValue !== "undefined"
    ) {
      setLocalStorageItem(key, initialValue);
    }
  }, [key, initialValue]);

  return [store ? JSON.parse(store) : initialValue, setState];
}
