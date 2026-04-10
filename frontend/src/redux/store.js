import { combineReducers, configureStore } from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import productSlice from './productSlice' 
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
// import storage from 'redux-persist/lib/storage/index.js'
const storage = {
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
}

const persistConfig = {
  key: 'Clothsite',
  version: 1,
  storage,
}

const rootReducer = combineReducers({
    user: userSlice,
    product: productSlice
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export default store