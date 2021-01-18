import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';

import { persistStore } from 'redux-persist'

import rootReducer from '../reducers/reducer';
import thunk from 'redux-thunk';

const store = createStore(
  rootReducer,
  applyMiddleware(logger, thunk)
);

const persistor = persistStore(store)
export { persistor, store }
