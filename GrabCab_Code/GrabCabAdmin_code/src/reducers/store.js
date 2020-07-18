
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from 'redux-logger'

import auth from "./authreducer";
import cartypes from "./cartypesreducer";
import bookingdata from "./bookingsreducer";
import promodata from "./promoreducer";
import usersdata from "./usersreducer";
import referraldata from "./referralreducer";
import notificationdata from "./notificationreducer";
import driverearningdata from './driverearningreducer';
import Earningreportsdata from './earningreportsreducer';
import settingsdata from './settingsreducer';

const reducers = combineReducers({
  auth,
  cartypes,
  bookingdata,
  promodata,
  usersdata,
  referraldata,
  notificationdata,
  driverearningdata,
  Earningreportsdata,
  settingsdata
});

let middleware = [];
if (process.env.NODE_ENV === 'development') {
  middleware = [...middleware, thunk, logger];
} else {
  middleware = [...middleware, thunk];
}

export const store = createStore(reducers, {}, applyMiddleware(...middleware));
