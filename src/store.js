import { AsyncStorage } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';

import accountReducer from '@modules/account/reducers';
import locationReducer from '@modules/location/reducers';
import bookingReducer from '@modules/booking/reducers';

const peresistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: [
        'accountReducer',
    ],
    blacklist: [
        'locationReducer',
        'bookingReducer',
    ]
}

const rootReducer = combineReducers({
    account: accountReducer,
    location: locationReducer,
    booking: bookingReducer,
});

const persistedReducer = persistReducer(peresistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    applyMiddleware(
        createLogger(),
    )
)

let persistor = persistStore(store);

export {
    store, persistor,
}
