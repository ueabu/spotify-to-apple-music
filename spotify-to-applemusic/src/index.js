import React from 'react';
import ReactDOM from 'react-dom';
import './main.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as apple_auth from './apple/apple-auth'

import { Provider } from 'react-redux'
import { store } from './modules/store/store'

apple_auth.configure()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
