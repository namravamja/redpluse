'use client'
import { useRef } from 'react'
import { makeStore, AppStore } from './lib/store'
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./lib/store";
import { Toaster } from 'react-hot-toast'


export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster />
        {children}
      </PersistGate>
    </Provider>
  );
} 