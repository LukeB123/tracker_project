"use client";
import React, { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/app/lib/store";

export default function StoreProvider({
  children,
}: // any initial state values here
{
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    // Any initial state values that need to be set by a parent component can be set here and passed into StoreProvider as props
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
